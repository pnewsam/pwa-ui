"use client";

import * as React from "react";

export type Haptics = {
  supported: boolean;
  vibrate: (pattern: number | number[]) => boolean;
  tap: () => boolean;
  success: () => boolean;
  warning: () => boolean;
  error: () => boolean;
};

const patterns = {
  tap: 10,
  success: [10, 40, 20],
  warning: [30, 40, 30],
  error: [40, 60, 40],
} as const;

function subscribe() {
  return () => undefined;
}

function getSupportedSnapshot() {
  return typeof navigator !== "undefined" && typeof navigator.vibrate === "function";
}

function getServerSnapshot() {
  return false;
}

export function useHaptics(): Haptics {
  const supported = React.useSyncExternalStore(subscribe, getSupportedSnapshot, getServerSnapshot);

  const vibrate = React.useCallback((pattern: number | number[]) => {
    if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return false;

    try {
      return navigator.vibrate(pattern);
    } catch {
      return false;
    }
  }, []);

  const tap = React.useCallback(() => vibrate(patterns.tap), [vibrate]);
  const success = React.useCallback(() => vibrate([...patterns.success]), [vibrate]);
  const warning = React.useCallback(() => vibrate([...patterns.warning]), [vibrate]);
  const error = React.useCallback(() => vibrate([...patterns.error]), [vibrate]);

  return React.useMemo(() => ({ supported, vibrate, tap, success, warning, error }), [error, success, supported, tap, vibrate, warning]);
}
