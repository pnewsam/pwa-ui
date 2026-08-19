"use client";

import * as React from "react";

export type InstallPromptOutcome = "accepted" | "dismissed";
export type InstallPromptResult = InstallPromptOutcome | "unavailable" | "error";
export type InstallPromptType = "native" | "ios-manual" | "unavailable";
export type InstallPromptStatus =
  | "unknown"
  | "unavailable"
  | "available"
  | "prompting"
  | InstallPromptOutcome
  | "installed"
  | "error";

type NativeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: InstallPromptOutcome; platform: string }>;
};

function isIOS() {
  const navigatorWithTouch = window.navigator as Navigator & { maxTouchPoints?: number };
  return /iPad|iPhone|iPod/.test(window.navigator.userAgent)
    || (window.navigator.platform === "MacIntel" && (navigatorWithTouch.maxTouchPoints ?? 0) > 1);
}

function isInstalled() {
  const navigatorWithStandalone = window.navigator as Navigator & { standalone?: boolean };
  return Boolean(
    navigatorWithStandalone.standalone
    || window.matchMedia("(display-mode: standalone)").matches
    || window.matchMedia("(display-mode: fullscreen)").matches,
  );
}

export function useInstallPrompt() {
  const promptEventRef = React.useRef<NativeInstallPromptEvent | null>(null);
  const activePromptRef = React.useRef<Promise<InstallPromptResult> | null>(null);
  const mountedRef = React.useRef(false);
  const [status, setStatus] = React.useState<InstallPromptStatus>("unknown");
  const [manualPlatform, setManualPlatform] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    mountedRef.current = true;

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      promptEventRef.current = event as NativeInstallPromptEvent;
      setError(null);
      setStatus("available");
    };
    const handleInstalled = () => {
      promptEventRef.current = null;
      setError(null);
      setManualPlatform(false);
      setStatus("installed");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);
    const installed = isInstalled();
    setManualPlatform(!installed && isIOS());
    setStatus(installed ? "installed" : "unavailable");

    return () => {
      mountedRef.current = false;
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const prompt = React.useCallback(() => {
    if (activePromptRef.current) return activePromptRef.current;

    const event = promptEventRef.current;
    if (!event) return Promise.resolve("unavailable" as const);

    promptEventRef.current = null;
    setError(null);
    setStatus("prompting");

    const activePrompt = (async () => {
      try {
        await event.prompt();
        const choice = await event.userChoice;
        if (mountedRef.current) setStatus(choice.outcome);
        return choice.outcome;
      } catch (cause) {
        const nextError = cause instanceof Error ? cause : new Error("The install prompt could not be opened.");
        if (mountedRef.current) {
          setError(nextError);
          setStatus("error");
        }
        return "error" as const;
      } finally {
        activePromptRef.current = null;
      }
    })();

    activePromptRef.current = activePrompt;
    return activePrompt;
  }, []);

  const promptType: InstallPromptType = status === "available" || status === "prompting"
    ? "native"
    : manualPlatform ? "ios-manual" : "unavailable";

  return {
    status,
    error,
    promptType,
    canPrompt: status === "available",
    canInstallManually: promptType === "ios-manual",
    isInstalled: status === "installed",
    prompt,
  };
}
