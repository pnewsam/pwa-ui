"use client";

import * as React from "react";

import { useDisplayMode } from "@/hooks/use-display-mode";

export type StackBackGestureMode = "auto" | "on" | "off";
export type StackBackGestureState = "idle" | "tracking" | "completing" | "canceling";

type Gesture = {
  pointerId: number;
  startX: number;
  startY: number;
  distance: number;
  claimed: boolean;
  rejected: boolean;
  lastX: number;
  lastAt: number;
  velocity: number;
};

type UseStackBackGestureOptions = {
  mode: StackBackGestureMode;
  depth: number;
  activeKey: string | undefined;
  transitioning: boolean;
  edgeWidth: number;
  threshold: number;
  rootRef: React.RefObject<HTMLDivElement | null>;
  scrimRef: React.RefObject<HTMLDivElement | null>;
  getView: (key: string) => HTMLElement | undefined;
  previousKey: string | undefined;
  onCommit: (key: string) => void;
  onStateChange?: (state: StackBackGestureState) => void;
};

function safeAreaLeft(root: HTMLElement) {
  const probe = document.createElement("span");
  probe.setAttribute("aria-hidden", "true");
  probe.style.cssText = "position:absolute;visibility:hidden;pointer-events:none;width:var(--pwa-safe-left,0px)";
  root.append(probe);
  const width = probe.getBoundingClientRect().width;
  probe.remove();
  return width;
}

export function useStackBackGesture({
  mode,
  depth,
  activeKey,
  transitioning,
  edgeWidth,
  threshold,
  rootRef,
  scrimRef,
  getView,
  previousKey,
  onCommit,
  onStateChange,
}: UseStackBackGestureOptions) {
  const displayMode = useDisplayMode();
  const gestureRef = React.useRef<Gesture | null>(null);
  const frameRef = React.useRef<number | null>(null);
  const pendingDistanceRef = React.useRef(0);
  const stateRef = React.useRef<StackBackGestureState>("idle");
  const settleRef = React.useRef<Animation[]>([]);
  const enabled = mode === "on" || (mode === "auto" && (displayMode === "standalone" || displayMode === "fullscreen"));

  const updateState = React.useCallback((state: StackBackGestureState) => {
    if (stateRef.current === state) return;
    stateRef.current = state;
    const root = rootRef.current;
    if (root) root.dataset.backGestureState = state;
    onStateChange?.(state);
  }, [onStateChange, rootRef]);

  const resetStyles = React.useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    settleRef.current.forEach((animation) => animation.cancel());
    settleRef.current = [];
    const root = rootRef.current;
    root?.style.setProperty("--pwa-stack-swipe-progress", "0");
    root?.style.setProperty("--pwa-stack-swipe-x", "0px");
    root?.style.setProperty("--pwa-stack-swipe-under-x", "-12%");
    root?.removeAttribute("data-swiping");
    if (activeKey) getView(activeKey)?.removeAttribute("data-swipe-active");
    if (previousKey) getView(previousKey)?.removeAttribute("data-swipe-under");
    scrimRef.current?.removeAttribute("data-active");
    gestureRef.current = null;
    updateState("idle");
  }, [activeKey, getView, previousKey, rootRef, scrimRef, updateState]);

  const writeProgress = React.useCallback((distance: number) => {
    const root = rootRef.current;
    if (!root) return;
    const width = Math.max(1, root.getBoundingClientRect().width);
    const clamped = Math.min(width, Math.max(0, distance));
    const progress = clamped / width;
    root.style.setProperty("--pwa-stack-swipe-progress", String(progress));
    root.style.setProperty("--pwa-stack-swipe-x", `${clamped}px`);
    root.style.setProperty("--pwa-stack-swipe-under-x", `${-(width - clamped) * 0.12}px`);
  }, [rootRef]);

  const queueProgress = React.useCallback((distance: number) => {
    pendingDistanceRef.current = distance;
    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      writeProgress(pendingDistanceRef.current);
    });
  }, [writeProgress]);

  const beginTracking = React.useCallback((target: HTMLElement, pointerId: number) => {
    const root = rootRef.current;
    if (!root || !activeKey || !previousKey) return;
    root.setAttribute("data-swiping", "");
    getView(activeKey)?.setAttribute("data-swipe-active", "");
    getView(previousKey)?.setAttribute("data-swipe-under", "");
    scrimRef.current?.setAttribute("data-active", "");
    try {
      target.setPointerCapture(pointerId);
    } catch {
      // Synthetic events and older engines may reject pointer capture.
    }
    updateState("tracking");
  }, [activeKey, getView, previousKey, rootRef, scrimRef, updateState]);

  const settle = React.useCallback((commit: boolean) => {
    const root = rootRef.current;
    const gesture = gestureRef.current;
    const top = activeKey ? getView(activeKey) : undefined;
    const under = previousKey ? getView(previousKey) : undefined;
    if (!root || !gesture || !top || !activeKey) {
      resetStyles();
      return;
    }

    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      writeProgress(gesture.distance);
    }

    const width = Math.max(1, root.getBoundingClientRect().width);
    const fromX = Math.min(width, Math.max(0, gesture.distance));
    const fromProgress = fromX / width;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    updateState(commit ? "completing" : "canceling");

    if (reduced || typeof top.animate !== "function") {
      if (commit) onCommit(activeKey);
      resetStyles();
      return;
    }

    const duration = commit ? Math.max(100, 220 * (1 - fromProgress)) : Math.max(100, 220 * fromProgress);
    const easing = commit ? "cubic-bezier(.2,.8,.2,1)" : "cubic-bezier(.2,.8,.2,1)";
    const animations = [
      top.animate(
        [{ transform: `translateX(${fromX}px)` }, { transform: `translateX(${commit ? width : 0}px)` }],
        { duration, easing, fill: "forwards" },
      ),
    ];
    if (under) {
      animations.push(under.animate(
        [
          { transform: `translateX(${-(width - fromX) * 0.12}px)` },
          { transform: `translateX(${commit ? 0 : -width * 0.12}px)` },
        ],
        { duration, easing, fill: "forwards" },
      ));
    }
    const scrim = scrimRef.current;
    if (scrim) {
      animations.push(scrim.animate(
        [{ opacity: String((1 - fromProgress) * 0.18) }, { opacity: commit ? "0" : "0.18" }],
        { duration, easing, fill: "forwards" },
      ));
    }
    settleRef.current = animations;

    void animations[0].finished.catch(() => undefined).then(() => {
      if (commit) onCommit(activeKey);
      resetStyles();
    });
  }, [activeKey, getView, onCommit, previousKey, resetStyles, rootRef, scrimRef, updateState, writeProgress]);

  React.useEffect(() => {
    const root = rootRef.current;
    if (root) root.dataset.backGestureEnabled = enabled ? "true" : "false";
    if ((!enabled || transitioning || depth < 2) && gestureRef.current) resetStyles();
  }, [depth, enabled, resetStyles, rootRef, transitioning]);

  React.useEffect(() => resetStyles, [resetStyles]);

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    const root = rootRef.current;
    if (!root || !enabled || transitioning || depth < 2 || gestureRef.current || event.pointerType === "mouse") return;
    const rect = root.getBoundingClientRect();
    const relativeX = event.clientX - rect.left;
    if (relativeX < 0 || relativeX > safeAreaLeft(root) + Math.max(0, edgeWidth)) return;

    const now = performance.now();
    gestureRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      distance: 0,
      claimed: false,
      rejected: false,
      lastX: event.clientX,
      lastAt: now,
      velocity: 0,
    };
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId || gesture.rejected) return;
    const deltaX = event.clientX - gesture.startX;
    const deltaY = event.clientY - gesture.startY;

    if (!gesture.claimed) {
      if (Math.abs(deltaY) >= 8 && Math.abs(deltaY) > Math.abs(deltaX)) {
        gesture.rejected = true;
        gestureRef.current = null;
        return;
      }
      if (deltaX < 8 || deltaX < Math.abs(deltaY) * 1.2) return;
      gesture.claimed = true;
      beginTracking(event.currentTarget, event.pointerId);
    }

    event.preventDefault();
    const now = performance.now();
    const elapsed = Math.max(1, now - gesture.lastAt);
    gesture.velocity = (event.clientX - gesture.lastX) / elapsed;
    gesture.lastX = event.clientX;
    gesture.lastAt = now;
    gesture.distance = Math.max(0, deltaX);
    queueProgress(gesture.distance);
  }

  function finishPointer(event: React.PointerEvent<HTMLDivElement>, cancelled: boolean) {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (!gesture.claimed || cancelled) {
      if (gesture.claimed) settle(false);
      else resetStyles();
      return;
    }

    const width = Math.max(1, rootRef.current?.getBoundingClientRect().width ?? 1);
    const commitsByDistance = gesture.distance / width >= Math.min(1, Math.max(0, threshold));
    const commitsByVelocity = gesture.distance >= 24 && gesture.velocity >= 0.5;
    settle(commitsByDistance || commitsByVelocity);
  }

  return {
    enabled,
    onPointerDown,
    onPointerMove,
    onPointerUp: (event: React.PointerEvent<HTMLDivElement>) => finishPointer(event, false),
    onPointerCancel: (event: React.PointerEvent<HTMLDivElement>) => finishPointer(event, true),
  };
}
