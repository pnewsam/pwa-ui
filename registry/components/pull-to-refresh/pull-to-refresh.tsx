"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type PullToRefreshState = "idle" | "pulling" | "armed" | "refreshing";

type PullToRefreshStyle = React.CSSProperties & {
  "--pwa-pull-distance"?: string;
};

export type PullToRefreshProps = Omit<React.ComponentPropsWithoutRef<"div">, "onRefresh"> & {
  onRefresh: () => void | Promise<void>;
  disabled?: boolean;
  threshold?: number;
  maxPull?: number;
  refreshing?: boolean;
  indicator?: React.ReactNode;
};

type PullGesture = {
  pointerId: number;
  startX: number;
  startY: number;
  claimed: boolean;
};

function resistedDistance(distance: number, maxPull: number) {
  return maxPull * (1 - Math.exp(-Math.max(0, distance) / maxPull));
}

export function PullToRefresh({
  onRefresh,
  disabled = false,
  threshold = 70,
  maxPull = 140,
  refreshing: controlledRefreshing,
  indicator,
  children,
  className,
  style,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onPointerLeave,
  onScroll,
  ...props
}: PullToRefreshProps) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const gestureRef = React.useRef<PullGesture | null>(null);
  const mountedRef = React.useRef(true);
  const refreshInFlightRef = React.useRef(false);
  const stateRef = React.useRef<PullToRefreshState>("idle");
  const [state, setState] = React.useState<PullToRefreshState>("idle");
  const [internalRefreshing, setInternalRefreshing] = React.useState(false);
  const refreshing = controlledRefreshing ?? internalRefreshing;

  const updateState = React.useCallback((nextState: PullToRefreshState) => {
    stateRef.current = nextState;
    setState((current) => current === nextState ? current : nextState);
  }, []);

  const updateDistance = React.useCallback((distance: number) => {
    rootRef.current?.style.setProperty("--pwa-pull-distance", `${Math.max(0, distance)}px`);
  }, []);

  const resetGesture = React.useCallback(() => {
    gestureRef.current = null;
    if (!refreshInFlightRef.current && controlledRefreshing !== true) {
      updateDistance(0);
      updateState("idle");
    }
  }, [controlledRefreshing, updateDistance, updateState]);

  const runRefresh = React.useCallback(async () => {
    if (refreshInFlightRef.current || disabled) return;

    refreshInFlightRef.current = true;
    setInternalRefreshing(true);
    updateDistance(threshold);
    updateState("refreshing");

    try {
      await onRefresh();
    } catch (error) {
      console.warn("PullToRefresh onRefresh rejected.", error);
    } finally {
      refreshInFlightRef.current = false;
      if (mountedRef.current) {
        setInternalRefreshing(false);
        if (controlledRefreshing !== true) {
          updateDistance(0);
          updateState("idle");
        }
      }
    }
  }, [controlledRefreshing, disabled, onRefresh, threshold, updateDistance, updateState]);

  React.useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  React.useEffect(() => {
    if (refreshing) {
      updateDistance(threshold);
      updateState("refreshing");
      return;
    }

    if (!gestureRef.current) {
      updateDistance(0);
      updateState("idle");
    }
  }, [refreshing, threshold, updateDistance, updateState]);

  React.useEffect(() => {
    if (!disabled) return;
    resetGesture();
  }, [disabled, resetGesture]);

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    onPointerDown?.(event);
    if (event.defaultPrevented || disabled || refreshing || gestureRef.current) return;
    if (event.pointerType === "mouse" || event.currentTarget.scrollTop > 0) return;

    gestureRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      claimed: false,
    };
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    onPointerMove?.(event);
    if (event.defaultPrevented) return;

    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId || disabled || refreshing) return;

    const deltaX = event.clientX - gesture.startX;
    const deltaY = event.clientY - gesture.startY;

    if (!gesture.claimed) {
      if (deltaY <= 0 || Math.abs(deltaX) > Math.abs(deltaY)) {
        gestureRef.current = null;
        return;
      }
      if (deltaY < 4) return;
      if (event.currentTarget.scrollTop > 0) {
        gestureRef.current = null;
        return;
      }

      gesture.claimed = true;
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // Synthetic events and older engines can reject pointer capture.
      }
    }

    event.preventDefault();
    const distance = resistedDistance(deltaY, Math.max(maxPull, threshold));
    updateDistance(distance);
    updateState(distance >= threshold ? "armed" : "pulling");
  }

  function finishPointer(event: React.PointerEvent<HTMLDivElement>, cancelled: boolean) {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;

    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const shouldRefresh = !cancelled && gesture.claimed && stateRef.current === "armed";
    gestureRef.current = null;
    if (shouldRefresh) void runRefresh();
    else resetGesture();
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    finishPointer(event, false);
    onPointerUp?.(event);
  }

  function handlePointerCancel(event: React.PointerEvent<HTMLDivElement>) {
    finishPointer(event, true);
    onPointerCancel?.(event);
  }

  function handlePointerLeave(event: React.PointerEvent<HTMLDivElement>) {
    const gesture = gestureRef.current;
    if (gesture && !gesture.claimed) resetGesture();
    onPointerLeave?.(event);
  }

  function handleScroll(event: React.UIEvent<HTMLDivElement>) {
    if (event.currentTarget.scrollTop > 0 && !gestureRef.current?.claimed) gestureRef.current = null;
    onScroll?.(event);
  }

  const status = state === "refreshing"
    ? "Refreshing…"
    : state === "armed" ? "Release to refresh" : "Pull to refresh";

  return (
    <div
      ref={rootRef}
      data-slot="pull-to-refresh"
      data-state={state}
      data-disabled={disabled ? "" : undefined}
      aria-busy={state === "refreshing" || undefined}
      className={cn(
        "relative min-h-0 overflow-y-auto overscroll-contain [touch-action:pan-y]",
        className,
      )}
      style={{ "--pwa-pull-distance": "0px", ...style } as PullToRefreshStyle}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onPointerLeave={handlePointerLeave}
      onScroll={handleScroll}
      {...props}
    >
      <div
        data-slot="pull-to-refresh-indicator"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-14 items-center justify-center gap-2 text-xs font-medium text-muted-foreground transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-opacity"
        style={{ transform: "translateY(calc(-100% + var(--pwa-pull-distance)))" }}
      >
        {indicator ?? (
          <span
            aria-hidden="true"
            className={cn(
              "size-4 rounded-full border-2 border-muted-foreground/25 border-t-current",
              state === "refreshing" && "animate-spin motion-reduce:animate-none",
            )}
          />
        )}
        <span>{status}</span>
      </div>
      <div
        data-slot="pull-to-refresh-content"
        className="min-h-full transition-transform duration-200 ease-out motion-reduce:transition-none"
        style={{ transform: "translateY(var(--pwa-pull-distance))" }}
      >
        {children}
      </div>
    </div>
  );
}
