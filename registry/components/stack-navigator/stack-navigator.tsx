"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import {
  useStackBackGesture,
  type StackBackGestureMode,
  type StackBackGestureState,
} from "./use-stack-back-gesture";

export type StackNavigatorEntry = {
  key: string;
  content: React.ReactNode;
  label?: string;
};

export type StackNavigatorProps = Omit<React.ComponentPropsWithoutRef<"div">, "children"> & {
  entries: StackNavigatorEntry[];
  onPop: (key: string) => void;
  onDepthChange?: (depth: number) => void;
  backGesture?: StackBackGestureMode;
  backGestureEdgeWidth?: number;
  backGestureThreshold?: number;
  onBackGestureStateChange?: (state: StackBackGestureState) => void;
};

type StackNavigatorContextValue = {
  depth: number;
  canPop: boolean;
  pop: () => void;
};

type RenderState = {
  sourceEntries: StackNavigatorEntry[];
  renderedEntries: StackNavigatorEntry[];
  enteringKey: string | null;
  exitingKey: string | null;
  underKey: string | null;
  revealingKey: string | null;
  transitionId: number;
};

const StackNavigatorContext = React.createContext<StackNavigatorContextValue | null>(null);
const transitionDuration = 240;

function sameKeys(a: StackNavigatorEntry[], b: StackNavigatorEntry[]) {
  return a.length === b.length && a.every((entry, index) => entry.key === b[index]?.key);
}

function nextRenderState(current: RenderState, entries: StackNavigatorEntry[]): RenderState {
  const previous = current.sourceEntries;
  if (sameKeys(previous, entries)) {
    const currentKeys = new Set(entries.map((entry) => entry.key));
    return {
      ...current,
      sourceEntries: entries,
      renderedEntries: current.renderedEntries.map((rendered) => (
        currentKeys.has(rendered.key) ? entries.find((entry) => entry.key === rendered.key)! : rendered
      )),
    };
  }

  const previousTop = previous.at(-1);
  const nextTop = entries.at(-1);
  const popping = entries.length < previous.length;

  if (popping && previousTop) {
    return {
      sourceEntries: entries,
      renderedEntries: [...entries, previousTop],
      enteringKey: null,
      exitingKey: previousTop.key,
      underKey: null,
      revealingKey: nextTop?.key ?? null,
      transitionId: current.transitionId + 1,
    };
  }

  return {
    sourceEntries: entries,
    renderedEntries: entries,
    enteringKey: nextTop?.key ?? null,
    exitingKey: null,
    underKey: previousTop?.key ?? null,
    revealingKey: null,
    transitionId: current.transitionId + 1,
  };
}

function focusView(node: HTMLElement | undefined) {
  if (!node) return;
  const autofocus = node.querySelector<HTMLElement>("[autofocus], [data-autofocus]");
  (autofocus ?? node).focus({ preventScroll: true });
}

export function StackNavigator({
  entries,
  onPop,
  onDepthChange,
  backGesture = "auto",
  backGestureEdgeWidth = 24,
  backGestureThreshold = 0.5,
  onBackGestureStateChange,
  className,
  style,
  onPointerDownCapture,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  ...props
}: StackNavigatorProps) {
  const [renderState, setRenderState] = React.useState<RenderState>(() => ({
    sourceEntries: entries,
    renderedEntries: entries,
    enteringKey: null,
    exitingKey: null,
    underKey: null,
    revealingKey: null,
    transitionId: 0,
  }));
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const scrimRef = React.useRef<HTMLDivElement | null>(null);
  const viewRefs = React.useRef(new Map<string, HTMLElement>());
  const focusTargets = React.useRef(new Map<string, HTMLElement>());
  const lastInteractionRef = React.useRef<{ target: HTMLElement; at: number } | null>(null);
  const transitionTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const gesturePopKeyRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (entries === renderState.sourceEntries) return;
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;
      const nextState = nextRenderState(renderState, entries);
      if (sameKeys(renderState.sourceEntries, entries)) {
        setRenderState(nextState);
        return;
      }
      const previousTop = renderState.sourceEntries.at(-1);
      if (previousTop?.key === gesturePopKeyRef.current && entries.length < renderState.sourceEntries.length) {
        gesturePopKeyRef.current = null;
        setRenderState({
          sourceEntries: entries,
          renderedEntries: entries,
          enteringKey: null,
          exitingKey: previousTop.key,
          underKey: null,
          revealingKey: null,
          transitionId: renderState.transitionId + 1,
        });
        return;
      }
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const root = rootRef.current;

      root?.setAttribute("data-transition-mode", reducedMotion ? "reduced" : "css");
      setRenderState(nextState);
    });

    return () => {
      cancelled = true;
    };
  }, [entries, renderState]);

  const activeKey = renderState.sourceEntries.at(-1)?.key;
  const previousKey = renderState.sourceEntries.at(-2)?.key;
  const depth = renderState.sourceEntries.length;
  const canPop = depth > 1;
  const pop = React.useCallback(() => {
    const top = renderState.sourceEntries.at(-1);
    if (renderState.sourceEntries.length > 1 && top) onPop(top.key);
  }, [onPop, renderState.sourceEntries]);

  React.useEffect(() => {
    onDepthChange?.(depth);
  }, [depth, onDepthChange]);

  React.useLayoutEffect(() => {
    if (!renderState.transitionId) return;
    const enteringKey = renderState.enteringKey;
    const exitingKey = renderState.exitingKey;
    const reducedMotion = rootRef.current?.dataset.transitionMode === "reduced";
    const settleDelay = reducedMotion ? 0 : transitionDuration;
    const activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    if (enteringKey) {
      const recentInteraction = lastInteractionRef.current;
      const returnTarget = recentInteraction && performance.now() - recentInteraction.at < 750
        ? recentInteraction.target
        : activeElement && activeElement !== document.body ? activeElement : null;
      if (returnTarget?.isConnected) focusTargets.current.set(enteringKey, returnTarget);
      const enteringView = viewRefs.current.get(enteringKey);
      focusView(enteringView);
      let secondFrame = 0;
      const firstFrame = window.requestAnimationFrame(() => {
        secondFrame = window.requestAnimationFrame(() => {
          enteringView?.removeAttribute("data-entering");
        });
      });
      transitionTimerRef.current = setTimeout(() => {
        setRenderState((current) => current.transitionId === renderState.transitionId
          ? { ...current, renderedEntries: current.sourceEntries, enteringKey: null, exitingKey: null, underKey: null, revealingKey: null }
          : current);
      }, settleDelay);
      return () => {
        window.cancelAnimationFrame(firstFrame);
        window.cancelAnimationFrame(secondFrame);
        if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      };
    }

    if (exitingKey) {
      const target = focusTargets.current.get(exitingKey);
      const revealedView = activeKey ? viewRefs.current.get(activeKey) : undefined;
      if (target?.isConnected) target.focus({ preventScroll: true });
      else focusView(revealedView);
      focusTargets.current.delete(exitingKey);
      let secondFrame = 0;
      const firstFrame = window.requestAnimationFrame(() => {
        secondFrame = window.requestAnimationFrame(() => {
          revealedView?.removeAttribute("data-revealing");
        });
      });
      transitionTimerRef.current = setTimeout(() => {
        setRenderState((current) => current.transitionId === renderState.transitionId
          ? { ...current, renderedEntries: current.sourceEntries, enteringKey: null, exitingKey: null, underKey: null, revealingKey: null }
          : current);
      }, settleDelay);
      return () => {
        window.cancelAnimationFrame(firstFrame);
        window.cancelAnimationFrame(secondFrame);
        if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      };
    }
  }, [activeKey, renderState.enteringKey, renderState.exitingKey, renderState.transitionId]);

  const context = React.useMemo<StackNavigatorContextValue>(() => ({ depth, canPop, pop }), [canPop, depth, pop]);
  const getView = React.useCallback((key: string) => viewRefs.current.get(key), []);
  const gesture = useStackBackGesture({
    mode: backGesture,
    depth,
    activeKey,
    transitioning: Boolean(renderState.enteringKey || renderState.exitingKey),
    edgeWidth: backGestureEdgeWidth,
    threshold: backGestureThreshold,
    rootRef,
    scrimRef,
    getView,
    previousKey,
    onCommit: (key) => {
      gesturePopKeyRef.current = key;
      onPop(key);
    },
    onStateChange: onBackGestureStateChange,
  });
  const activeIndex = renderState.renderedEntries.findIndex((entry) => entry.key === activeKey);

  return (
    <StackNavigatorContext.Provider value={context}>
      <div
        ref={rootRef}
        data-slot="stack-navigator"
        data-depth={depth}
        data-back-gesture-state="idle"
        data-transitioning={renderState.enteringKey || renderState.exitingKey ? "" : undefined}
        className={cn("relative isolate h-full min-h-0 overflow-hidden bg-background", className)}
        style={{
          "--pwa-stack-transition-duration": `${transitionDuration}ms`,
          "--pwa-stack-swipe-progress": "0",
          "--pwa-stack-swipe-x": "0px",
          "--pwa-stack-swipe-under-x": "-12%",
          ...style,
        } as React.CSSProperties}
        onPointerDownCapture={(event) => {
          if (event.target instanceof HTMLElement) lastInteractionRef.current = { target: event.target, at: performance.now() };
          onPointerDownCapture?.(event);
        }}
        onPointerDown={(event) => {
          onPointerDown?.(event);
          if (!event.defaultPrevented) gesture.onPointerDown(event);
        }}
        onPointerMove={(event) => {
          onPointerMove?.(event);
          if (!event.defaultPrevented) gesture.onPointerMove(event);
        }}
        onPointerUp={(event) => {
          gesture.onPointerUp(event);
          onPointerUp?.(event);
        }}
        onPointerCancel={(event) => {
          gesture.onPointerCancel(event);
          onPointerCancel?.(event);
        }}
        {...props}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden bg-black data-[active]:block"
          data-slot="stack-swipe-scrim"
          ref={scrimRef}
          style={{
            opacity: "calc((1 - var(--pwa-stack-swipe-progress, 0)) * 0.18)",
            zIndex: Math.max(0, activeIndex * 2),
          }}
        />
        {renderState.renderedEntries.map((entry, index) => {
          const entering = entry.key === renderState.enteringKey;
          const exiting = entry.key === renderState.exitingKey;
          const under = entry.key === renderState.underKey;
          const revealing = entry.key === renderState.revealingKey;
          const animating = entering || exiting || under || revealing;
          const covered = entry.key !== activeKey;

          return (
            <section
              aria-hidden={covered || undefined}
              aria-label={entry.label}
              className={cn(
                "absolute inset-0 min-h-0 overflow-y-auto bg-background outline-none transition-transform duration-[var(--pwa-stack-transition-duration,240ms)] ease-[cubic-bezier(0.32,0.72,0,1)]",
                "data-[animating]:will-change-transform data-[entering]:translate-x-full data-[exiting]:translate-x-full",
                "data-[under]:-translate-x-[12%] data-[revealing]:-translate-x-[12%]",
                "data-[covered]:invisible data-[covered]:pointer-events-none data-[exiting]:!visible data-[under]:!visible",
                "data-[swipe-active]:!translate-x-[var(--pwa-stack-swipe-x)] data-[swipe-active]:!transition-none",
                "data-[swipe-under]:!visible data-[swipe-under]:!translate-x-[var(--pwa-stack-swipe-under-x)] data-[swipe-under]:!transition-none",
                "motion-reduce:transition-none",
              )}
              data-covered={covered ? "" : undefined}
              data-animating={animating ? "" : undefined}
              data-entering={entering ? "" : undefined}
              data-exiting={exiting ? "" : undefined}
              data-under={under ? "" : undefined}
              data-revealing={revealing ? "" : undefined}
              data-slot="stack-view"
              data-view-key={entry.key}
              inert={covered || undefined}
              key={entry.key}
              ref={(node) => {
                if (node) viewRefs.current.set(entry.key, node);
                else viewRefs.current.delete(entry.key);
              }}
              role={entry.label ? "group" : undefined}
              style={{ zIndex: index * 2 + 1 }}
              tabIndex={-1}
            >
              {entry.content}
            </section>
          );
        })}
      </div>
    </StackNavigatorContext.Provider>
  );
}

export function useStackNavigator(): StackNavigatorContextValue {
  const context = React.useContext(StackNavigatorContext);
  if (!context) throw new Error("useStackNavigator must be used within StackNavigator.");
  return context;
}
