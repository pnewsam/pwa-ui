"use client";

import * as React from "react";

export type ScrollRestorationOptions = {
  storage?: "memory" | "session";
  behavior?: "auto" | "instant";
};

export type ScrollRestorationHandle = {
  ref: (node: HTMLElement | null) => void;
  save: () => void;
  clear: (key?: string) => void;
};

const sessionPrefix = "pwa-ui:scroll:";
const retryWindow = 2_000;
const positions = new Map<string, number>();

function sessionKey(key: string) {
  return `${sessionPrefix}${key}`;
}

function readPosition(key: string, storage: "memory" | "session") {
  if (storage === "session" && typeof window !== "undefined") {
    try {
      const value = window.sessionStorage.getItem(sessionKey(key));
      if (value !== null) {
        const position = Number(value);
        if (Number.isFinite(position)) {
          positions.set(key, position);
          return position;
        }
      }
    } catch {
      // Privacy modes can make sessionStorage throw. Memory remains available.
    }
  }

  return positions.get(key);
}

function writePosition(key: string, position: number, storage: "memory" | "session") {
  positions.set(key, position);

  if (storage === "session" && typeof window !== "undefined") {
    try {
      window.sessionStorage.setItem(sessionKey(key), String(position));
    } catch {
      // The in-memory copy is the intentional fallback.
    }
  }
}

function clearPositions(key?: string) {
  if (key !== undefined) positions.delete(key);
  else positions.clear();

  if (typeof window === "undefined") return;

  try {
    if (key !== undefined) {
      window.sessionStorage.removeItem(sessionKey(key));
      return;
    }

    const keys: string[] = [];
    for (let index = 0; index < window.sessionStorage.length; index += 1) {
      const candidate = window.sessionStorage.key(index);
      if (candidate?.startsWith(sessionPrefix)) keys.push(candidate);
    }
    keys.forEach((candidate) => window.sessionStorage.removeItem(candidate));
  } catch {
    // Clearing memory still succeeds when storage is unavailable.
  }
}

export function useScrollRestoration(
  key: string,
  { storage = "memory", behavior = "instant" }: ScrollRestorationOptions = {},
): ScrollRestorationHandle {
  const nodeRef = React.useRef<HTMLElement | null>(null);
  const keyRef = React.useRef(key);
  const storageRef = React.useRef(storage);
  const behaviorRef = React.useRef(behavior);
  const scrollFrameRef = React.useRef(0);
  const restoreFrameRef = React.useRef(0);
  const restoreObserverRef = React.useRef<ResizeObserver | null>(null);
  const restoreDeadlineRef = React.useRef(0);
  const restoringRef = React.useRef(false);
  const userInterruptedRef = React.useRef(false);
  const removeScrollListenerRef = React.useRef<(() => void) | null>(null);

  const stopRestore = React.useCallback(() => {
    if (typeof window !== "undefined") window.cancelAnimationFrame(restoreFrameRef.current);
    restoreFrameRef.current = 0;
    restoreObserverRef.current?.disconnect();
    restoreObserverRef.current = null;
    restoringRef.current = false;
  }, []);

  const save = React.useCallback(() => {
    const node = nodeRef.current;
    if (!node) return;
    writePosition(keyRef.current, node.scrollTop, storageRef.current);
  }, []);

  const scheduleSave = React.useCallback(() => {
    if (typeof window === "undefined" || scrollFrameRef.current) return;
    scrollFrameRef.current = window.requestAnimationFrame(() => {
      scrollFrameRef.current = 0;
      save();
    });
  }, [save]);

  const restore = React.useCallback((node: HTMLElement) => {
    stopRestore();
    userInterruptedRef.current = false;
    const target = readPosition(keyRef.current, storageRef.current) ?? 0;

    restoreDeadlineRef.current = performance.now() + retryWindow;

    const attempt = () => {
      if (nodeRef.current !== node || userInterruptedRef.current) {
        stopRestore();
        return;
      }

      const maximum = Math.max(0, node.scrollHeight - node.clientHeight);
      const canReachTarget = target <= maximum + 1;
      const nextPosition = canReachTarget ? target : maximum;
      restoringRef.current = true;
      if (behaviorRef.current === "auto") node.scrollTo({ top: nextPosition, behavior: "auto" });
      else node.scrollTop = nextPosition;

      window.requestAnimationFrame(() => {
        restoringRef.current = false;
      });

      if (canReachTarget && Math.abs(node.scrollTop - target) <= 1) {
        stopRestore();
        return;
      }

      if (performance.now() >= restoreDeadlineRef.current) {
        stopRestore();
        return;
      }

      restoreFrameRef.current = window.requestAnimationFrame(attempt);
    };

    restoreObserverRef.current = typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver(attempt);
    restoreObserverRef.current?.observe(node);
    restoreFrameRef.current = window.requestAnimationFrame(attempt);
  }, [stopRestore]);

  const ref = React.useCallback((node: HTMLElement | null) => {
    const previousNode = nodeRef.current;
    if (previousNode) {
      save();
      removeScrollListenerRef.current?.();
      removeScrollListenerRef.current = null;
      stopRestore();
      window.cancelAnimationFrame(scrollFrameRef.current);
      scrollFrameRef.current = 0;
    }

    nodeRef.current = node;
    keyRef.current = key;
    storageRef.current = storage;
    behaviorRef.current = behavior;
    if (!node) return;

    const handleScroll = () => {
      if (restoringRef.current) return;
      if (restoreFrameRef.current || restoreObserverRef.current) {
        userInterruptedRef.current = true;
        stopRestore();
      }
      scheduleSave();
    };

    node.addEventListener("scroll", handleScroll, { passive: true });
    removeScrollListenerRef.current = () => node.removeEventListener("scroll", handleScroll);
    restore(node);
  }, [behavior, key, restore, save, scheduleSave, stopRestore, storage]);

  const clear = React.useCallback((storedKey?: string) => {
    clearPositions(storedKey);
  }, []);

  React.useEffect(() => {
    function saveForPageBoundary() {
      save();
    }

    function saveWhenHidden() {
      if (document.visibilityState === "hidden") save();
    }

    window.addEventListener("pagehide", saveForPageBoundary);
    document.addEventListener("visibilitychange", saveWhenHidden);
    return () => {
      window.removeEventListener("pagehide", saveForPageBoundary);
      document.removeEventListener("visibilitychange", saveWhenHidden);
    };
  }, [save]);

  return { ref, save, clear };
}
