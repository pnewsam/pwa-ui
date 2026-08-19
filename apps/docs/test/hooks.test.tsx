import React from "react";
import { act, fireEvent, render, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useInstallPrompt } from "../../../registry/hooks/use-install-prompt";
import { useMediaQuery } from "../../../registry/hooks/use-media-query";
import { useNetworkStatus } from "../../../registry/hooks/use-network-status";
import { usePageVisibility } from "../../../registry/hooks/use-page-visibility";
import { useServiceWorkerUpdate } from "../../../registry/hooks/use-service-worker-update";
import { useScrollRestoration } from "../../../registry/hooks/use-scroll-restoration";

const defaultMatchMedia = window.matchMedia;
const defaultUserAgent = window.navigator.userAgent;

afterEach(() => {
  Reflect.deleteProperty(window.navigator, "serviceWorker");
  Object.defineProperty(window, "matchMedia", { configurable: true, value: defaultMatchMedia });
  Object.defineProperty(window.navigator, "userAgent", { configurable: true, value: defaultUserAgent });
});

function mockMatchMedia(matching: string) {
  const listeners = new Map<string, Set<() => void>>();
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: (query: string) => ({
      matches: query === matching,
      media: query,
      addEventListener: (_type: string, listener: () => void) => {
        const queryListeners = listeners.get(query) ?? new Set();
        queryListeners.add(listener);
        listeners.set(query, queryListeners);
      },
      removeEventListener: (_type: string, listener: () => void) => listeners.get(query)?.delete(listener),
    }),
  });

  return (nextMatching: string) => {
    matching = nextMatching;
    act(() => listeners.forEach((queryListeners) => queryListeners.forEach((listener) => listener())));
  };
}

function ScrollRestorationProbe({
  viewKey,
  storage = "memory",
  scrollHeight = 600,
  clientHeight = 100,
}: {
  viewKey: string;
  storage?: "memory" | "session";
  scrollHeight?: number;
  clientHeight?: number;
}) {
  const { ref: restorationRef } = useScrollRestoration(viewKey, { storage });
  const ref = React.useCallback((node: HTMLDivElement | null) => {
    if (node) {
      Object.defineProperty(node, "scrollHeight", { configurable: true, value: scrollHeight });
      Object.defineProperty(node, "clientHeight", { configurable: true, value: clientHeight });
    }
    restorationRef(node);
  }, [clientHeight, restorationRef, scrollHeight]);

  return <div data-testid="scroll-region" ref={ref} />;
}

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

  it("reports the iOS manual install path when no browser prompt exists", () => {
    Object.defineProperty(window.navigator, "userAgent", { configurable: true, value: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15" });
    const { result } = renderHook(() => useInstallPrompt());

    expect(result.current).toMatchObject({ status: "unavailable", promptType: "ios-manual", canInstallManually: true, canPrompt: false });
  });

  it("prefers the native install path once a prompt is captured", () => {
    const { result } = renderHook(() => useInstallPrompt());
    expect(result.current.promptType).toBe("unavailable");

    act(() => window.dispatchEvent(Object.assign(new Event("beforeinstallprompt", { cancelable: true }), {
      prompt: vi.fn().mockResolvedValue(undefined),
      userChoice: Promise.resolve({ outcome: "accepted" as const, platform: "web" }),
    })));

    expect(result.current).toMatchObject({ promptType: "native", canInstallManually: false });
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

  it("resolves a media query in the first client render", () => {
    const query = "(max-width: 47.999rem)";
    const change = mockMatchMedia(query);
    const renders: boolean[] = [];

    function Probe() {
      renders.push(useMediaQuery(query));
      return null;
    }

    render(<Probe />);
    expect(renders).toEqual([true]);

    change("(min-width: 48rem)");
    expect(renders.at(-1)).toBe(false);
  });

  it("saves and restores a keyed scroll position", async () => {
    const first = render(<ScrollRestorationProbe viewKey="restore-basic" />);
    const firstRegion = first.container.querySelector<HTMLElement>('[data-testid="scroll-region"]')!;
    firstRegion.scrollTop = 128;
    fireEvent.scroll(firstRegion);
    first.unmount();

    const second = render(<ScrollRestorationProbe viewKey="restore-basic" />);
    const secondRegion = second.container.querySelector<HTMLElement>('[data-testid="scroll-region"]')!;
    await waitFor(() => expect(secondRegion.scrollTop).toBe(128));
  });

  it("saves the old key and restores the new key on a live element", async () => {
    const view = render(<ScrollRestorationProbe viewKey="tab-a" />);
    let region = view.container.querySelector<HTMLElement>('[data-testid="scroll-region"]')!;
    region.scrollTop = 84;
    fireEvent.scroll(region);

    view.rerender(<ScrollRestorationProbe viewKey="tab-b" />);
    region = view.container.querySelector<HTMLElement>('[data-testid="scroll-region"]')!;
    region.scrollTop = 26;
    fireEvent.scroll(region);

    view.rerender(<ScrollRestorationProbe viewKey="tab-a" />);
    region = view.container.querySelector<HTMLElement>('[data-testid="scroll-region"]')!;
    await waitFor(() => expect(region.scrollTop).toBe(84));
  });

  it("falls back to shared memory when session storage throws", async () => {
    const getItem = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("Unavailable");
    });
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Unavailable");
    });

    const first = render(<ScrollRestorationProbe storage="session" viewKey="private-mode" />);
    const firstRegion = first.container.querySelector<HTMLElement>('[data-testid="scroll-region"]')!;
    firstRegion.scrollTop = 72;
    first.unmount();

    const second = render(<ScrollRestorationProbe storage="session" viewKey="private-mode" />);
    const secondRegion = second.container.querySelector<HTMLElement>('[data-testid="scroll-region"]')!;
    await waitFor(() => expect(secondRegion.scrollTop).toBe(72));

    getItem.mockRestore();
    setItem.mockRestore();
  });

  it("retries restoration until late content can reach the saved offset", async () => {
    const first = render(<ScrollRestorationProbe viewKey="late-content" />);
    const firstRegion = first.container.querySelector<HTMLElement>('[data-testid="scroll-region"]')!;
    firstRegion.scrollTop = 240;
    first.unmount();

    const second = render(<ScrollRestorationProbe clientHeight={100} scrollHeight={100} viewKey="late-content" />);
    const secondRegion = second.container.querySelector<HTMLElement>('[data-testid="scroll-region"]')!;
    expect(secondRegion.scrollTop).toBe(0);

    Object.defineProperty(secondRegion, "scrollHeight", { configurable: true, value: 600 });
    await waitFor(() => expect(secondRegion.scrollTop).toBe(240));
  });
});
