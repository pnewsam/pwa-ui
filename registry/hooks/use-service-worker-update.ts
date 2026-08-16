"use client";

import * as React from "react";

export type ServiceWorkerUpdateStatus =
  | "unknown"
  | "unsupported"
  | "unregistered"
  | "idle"
  | "checking"
  | "installing"
  | "waiting"
  | "activating"
  | "updated"
  | "error";

export type UseServiceWorkerUpdateOptions = {
  scope?: string;
  checkOnMount?: boolean;
  checkOnVisible?: boolean;
};

type ApplyUpdateOptions = {
  reload?: boolean;
};

function toError(cause: unknown) {
  return cause instanceof Error ? cause : new Error("The service worker operation failed.");
}

export function useServiceWorkerUpdate({
  scope,
  checkOnMount = false,
  checkOnVisible = true,
}: UseServiceWorkerUpdateOptions = {}) {
  const registrationRef = React.useRef<ServiceWorkerRegistration | null>(null);
  const waitingWorkerRef = React.useRef<ServiceWorker | null>(null);
  const reloadOnControlRef = React.useRef(false);
  const mountedRef = React.useRef(false);
  const [status, setStatus] = React.useState<ServiceWorkerUpdateStatus>("unknown");
  const [error, setError] = React.useState<Error | null>(null);
  const [registration, setRegistration] = React.useState<ServiceWorkerRegistration | null>(null);

  React.useEffect(() => {
    mountedRef.current = true;
    registrationRef.current = null;
    waitingWorkerRef.current = null;
    reloadOnControlRef.current = false;
    let cancelled = false;
    let currentRegistration: ServiceWorkerRegistration | null = null;
    let installingWorker: ServiceWorker | null = null;
    let lastVisibleCheck = 0;

    if (!("serviceWorker" in navigator)) {
      setStatus("unsupported");
      return () => {
        mountedRef.current = false;
      };
    }

    const handleControllerChange = () => {
      if (cancelled) return;
      waitingWorkerRef.current = null;
      setError(null);
      setStatus("updated");
      const shouldReload = reloadOnControlRef.current;
      reloadOnControlRef.current = false;
      if (shouldReload) window.location.reload();
    };

    const handleInstallingStateChange = () => {
      if (cancelled || !installingWorker) return;

      if (installingWorker.state === "installed") {
        waitingWorkerRef.current = installingWorker;
        setStatus(navigator.serviceWorker.controller ? "waiting" : "idle");
      } else if (installingWorker.state === "redundant") {
        setStatus("error");
        setError(new Error("The service worker update became redundant before activation."));
      }
    };

    const watchInstallingWorker = (worker: ServiceWorker | null) => {
      installingWorker?.removeEventListener("statechange", handleInstallingStateChange);
      installingWorker = worker;
      if (!worker) return;
      setStatus("installing");
      worker.addEventListener("statechange", handleInstallingStateChange);
    };

    const handleUpdateFound = () => {
      if (!cancelled) watchInstallingWorker(currentRegistration?.installing ?? null);
    };

    const checkRegistration = async () => {
      if (!currentRegistration || currentRegistration.waiting || currentRegistration.installing) return;
      setError(null);
      setStatus("checking");
      try {
        await currentRegistration.update();
        if (!cancelled && !currentRegistration.installing && !currentRegistration.waiting) {
          setStatus("idle");
        }
      } catch (cause) {
        if (cancelled) return;
        setError(toError(cause));
        setStatus("error");
      }
    };

    const handleVisible = () => {
      if (!checkOnVisible || document.visibilityState !== "visible") return;
      const now = Date.now();
      if (now - lastVisibleCheck < 30_000) return;
      lastVisibleCheck = now;
      void checkRegistration();
    };

    navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);
    document.addEventListener("visibilitychange", handleVisible);
    window.addEventListener("pageshow", handleVisible);

    const initialize = async () => {
      try {
        const nextRegistration = await navigator.serviceWorker.getRegistration(scope);
        if (cancelled) return;

        currentRegistration = nextRegistration ?? null;
        registrationRef.current = currentRegistration;
        setRegistration(currentRegistration);

        if (!currentRegistration) {
          setStatus("unregistered");
          return;
        }

        currentRegistration.addEventListener("updatefound", handleUpdateFound);
        if (currentRegistration.waiting) {
          waitingWorkerRef.current = currentRegistration.waiting;
          setStatus("waiting");
        } else if (currentRegistration.installing) {
          watchInstallingWorker(currentRegistration.installing);
        } else {
          setStatus("idle");
        }

        if (checkOnMount) {
          lastVisibleCheck = Date.now();
          await checkRegistration();
        }
      } catch (cause) {
        if (cancelled) return;
        setError(toError(cause));
        setStatus("error");
      }
    };

    void initialize();

    return () => {
      cancelled = true;
      mountedRef.current = false;
      registrationRef.current = null;
      waitingWorkerRef.current = null;
      reloadOnControlRef.current = false;
      installingWorker?.removeEventListener("statechange", handleInstallingStateChange);
      currentRegistration?.removeEventListener("updatefound", handleUpdateFound);
      navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
      document.removeEventListener("visibilitychange", handleVisible);
      window.removeEventListener("pageshow", handleVisible);
    };
  }, [checkOnMount, checkOnVisible, scope]);

  const checkForUpdate = React.useCallback(async () => {
    const currentRegistration = registrationRef.current;
    if (!currentRegistration) return false;

    setError(null);
    setStatus("checking");
    try {
      await currentRegistration.update();
      if (!mountedRef.current) return false;
      if (currentRegistration.waiting) {
        waitingWorkerRef.current = currentRegistration.waiting;
        setStatus("waiting");
        return true;
      }
      if (!currentRegistration.installing) setStatus("idle");
      return Boolean(currentRegistration.installing);
    } catch (cause) {
      if (mountedRef.current) {
        setError(toError(cause));
        setStatus("error");
      }
      return false;
    }
  }, []);

  const applyUpdate = React.useCallback(({ reload = false }: ApplyUpdateOptions = {}) => {
    const worker = registrationRef.current?.waiting ?? waitingWorkerRef.current;
    if (!worker) return false;

    reloadOnControlRef.current = reload;
    setError(null);
    setStatus("activating");
    worker.postMessage({ type: "SKIP_WAITING" });
    return true;
  }, []);

  return {
    status,
    error,
    registration,
    updateAvailable: status === "waiting",
    checkForUpdate,
    applyUpdate,
  };
}
