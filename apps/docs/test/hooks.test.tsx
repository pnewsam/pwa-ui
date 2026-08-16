import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useInstallPrompt } from "../../../registry/hooks/use-install-prompt";
import { useNetworkStatus } from "../../../registry/hooks/use-network-status";
import { usePageVisibility } from "../../../registry/hooks/use-page-visibility";
import { useServiceWorkerUpdate } from "../../../registry/hooks/use-service-worker-update";

afterEach(() => {
  Reflect.deleteProperty(window.navigator, "serviceWorker");
});

describe("PWA UI hooks", () => {
  it("subscribes to browser network hints", () => {
    Object.defineProperty(window.navigator, "onLine", { configurable: true, value: false });
    const { result } = renderHook(() => useNetworkStatus());

    expect(result.current).toMatchObject({ status: "offline", isOnline: false });

    act(() => {
      Object.defineProperty(window.navigator, "onLine", { configurable: true, value: true });
      window.dispatchEvent(new Event("online"));
    });

    expect(result.current).toMatchObject({ status: "online", isOnline: true });
  });

  it("tracks the page visibility boundary", () => {
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" });
    const { result } = renderHook(() => usePageVisibility());

    expect(result.current).toMatchObject({ visibilityState: "hidden", isVisible: false });

    act(() => {
      Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" });
      document.dispatchEvent(new Event("visibilitychange"));
    });

    expect(result.current).toMatchObject({ visibilityState: "visible", isVisible: true });
  });

  it("owns one captured install prompt", async () => {
    const nativePrompt = vi.fn().mockResolvedValue(undefined);
    const installEvent = Object.assign(new Event("beforeinstallprompt", { cancelable: true }), {
      prompt: nativePrompt,
      userChoice: Promise.resolve({ outcome: "accepted" as const, platform: "web" }),
    });
    const { result } = renderHook(() => useInstallPrompt());

    act(() => window.dispatchEvent(installEvent));
    expect(result.current.status).toBe("available");

    await act(async () => {
      await result.current.prompt();
    });

    expect(nativePrompt).toHaveBeenCalledOnce();
    expect(result.current.status).toBe("accepted");
    await expect(result.current.prompt()).resolves.toBe("unavailable");
  });

  it("activates only an existing waiting service worker", async () => {
    const waitingWorker = Object.assign(new EventTarget(), {
      state: "installed" as ServiceWorkerState,
      postMessage: vi.fn(),
    });
    const registration = Object.assign(new EventTarget(), {
      waiting: waitingWorker,
      installing: null,
      update: vi.fn().mockResolvedValue(undefined),
    });
    const serviceWorker = Object.assign(new EventTarget(), {
      controller: {},
      getRegistration: vi.fn().mockResolvedValue(registration),
    });
    Object.defineProperty(window.navigator, "serviceWorker", { configurable: true, value: serviceWorker });

    const { result } = renderHook(() => useServiceWorkerUpdate());
    await waitFor(() => expect(result.current.status).toBe("waiting"));

    act(() => {
      expect(result.current.applyUpdate()).toBe(true);
    });

    expect(waitingWorker.postMessage).toHaveBeenCalledWith({ type: "SKIP_WAITING" });
    expect(result.current.status).toBe("activating");
  });

  it("checks an existing service worker after returning to the foreground", async () => {
    const registration = Object.assign(new EventTarget(), {
      waiting: null,
      installing: null,
      update: vi.fn().mockResolvedValue(undefined),
    });
    const serviceWorker = Object.assign(new EventTarget(), {
      controller: {},
      getRegistration: vi.fn().mockResolvedValue(registration),
    });
    Object.defineProperty(window.navigator, "serviceWorker", { configurable: true, value: serviceWorker });
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" });

    const { result } = renderHook(() => useServiceWorkerUpdate());
    await waitFor(() => expect(result.current.status).toBe("idle"));

    act(() => document.dispatchEvent(new Event("visibilitychange")));
    await waitFor(() => expect(registration.update).toHaveBeenCalledOnce());
  });
});
