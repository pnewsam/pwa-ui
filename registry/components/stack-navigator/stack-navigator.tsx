"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type StackNavigatorEntry = {
  key: string;
  content: React.ReactNode;
  label?: string;
};

export type StackNavigatorProps = Omit<React.ComponentPropsWithoutRef<"div">, "children"> & {
  entries: StackNavigatorEntry[];
  onPop: (key: string) => void;
  onDepthChange?: (depth: number) => void;
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
  transitionId: number;
};

const StackNavigatorContext = React.createContext<StackNavigatorContextValue | null>(null);
const fallbackDuration = 280;

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void | Promise<void>) => { finished: Promise<void> };
};

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
      transitionId: current.transitionId + 1,
    };
  }

  return {
    sourceEntries: entries,
    renderedEntries: entries,
    enteringKey: nextTop?.key ?? null,
    exitingKey: null,
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
  className,
  style,
  onPointerDownCapture,
  ...props
}: StackNavigatorProps) {
  const [renderState, setRenderState] = React.useState<RenderState>(() => ({
    sourceEntries: entries,
    renderedEntries: entries,
    enteringKey: null,
    exitingKey: null,
    transitionId: 0,
  }));
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const viewRefs = React.useRef(new Map<string, HTMLElement>());
  const focusTargets = React.useRef(new Map<string, HTMLElement>());
  const lastInteractionRef = React.useRef<{ target: HTMLElement; at: number } | null>(null);
  const transitionTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitionName = `${React.useId().replaceAll(":", "")}-pwa-stack-view`;

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
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const transitionDocument = document as ViewTransitionDocument;
      const startViewTransition = transitionDocument.startViewTransition;
      const root = rootRef.current;

      if (!reducedMotion && startViewTransition) {
        root?.setAttribute("data-transition-mode", "view");
        const previousTop = renderState.sourceEntries.at(-1);
        const previousView = previousTop ? viewRefs.current.get(previousTop.key) : undefined;
        if (previousView) previousView.style.viewTransitionName = transitionName;

        const direction = entries.length < renderState.sourceEntries.length ? "pop" : "push";
        const styleElement = document.createElement("style");
        styleElement.dataset.pwaStackTransition = transitionName;
        styleElement.textContent = direction === "push"
          ? `::view-transition-group(${transitionName}){animation-duration:${fallbackDuration}ms}::view-transition-old(${transitionName}){animation:pwa-stack-old-push ${fallbackDuration}ms ease-out both}::view-transition-new(${transitionName}){animation:pwa-stack-new-push ${fallbackDuration}ms ease-out both}@keyframes pwa-stack-old-push{to{transform:translateX(-12%);opacity:.92}}@keyframes pwa-stack-new-push{from{transform:translateX(100%);opacity:.96}to{transform:translateX(0);opacity:1}}`
          : `::view-transition-group(${transitionName}){animation-duration:${fallbackDuration}ms}::view-transition-old(${transitionName}){animation:pwa-stack-old-pop ${fallbackDuration}ms ease-out both}::view-transition-new(${transitionName}){animation:pwa-stack-new-pop ${fallbackDuration}ms ease-out both}@keyframes pwa-stack-old-pop{to{transform:translateX(100%);opacity:.96}}@keyframes pwa-stack-new-pop{from{transform:translateX(-12%);opacity:.92}to{transform:translateX(0);opacity:1}}`;
        document.head.append(styleElement);

        try {
          const transition = startViewTransition.call(transitionDocument, () => new Promise<void>((resolve) => {
            setRenderState(nextState);
            window.setTimeout(() => {
              previousView?.style.removeProperty("view-transition-name");
              const nextTop = entries.at(-1);
              const nextView = nextTop ? viewRefs.current.get(nextTop.key) : undefined;
              nextView?.removeAttribute("data-entering");
              if (nextState.exitingKey) viewRefs.current.get(nextState.exitingKey)?.removeAttribute("data-exiting");
              if (nextView) nextView.style.viewTransitionName = transitionName;
              resolve();
            }, 0);
          }));

          void transition.finished.catch(() => undefined).finally(() => {
            viewRefs.current.forEach((view) => view.style.removeProperty("view-transition-name"));
            styleElement.remove();
          });
          return;
        } catch {
          previousView?.style.removeProperty("view-transition-name");
          styleElement.remove();
        }
      }

      root?.setAttribute("data-transition-mode", reducedMotion ? "reduced" : "fallback");
      setRenderState(nextState);
    });

    return () => {
      cancelled = true;
    };
  }, [entries, renderState, transitionName]);

  const activeKey = renderState.sourceEntries.at(-1)?.key;
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
    const activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    if (enteringKey) {
      const recentInteraction = lastInteractionRef.current;
      const returnTarget = recentInteraction && performance.now() - recentInteraction.at < 750
        ? recentInteraction.target
        : activeElement && activeElement !== document.body ? activeElement : null;
      if (returnTarget?.isConnected) focusTargets.current.set(enteringKey, returnTarget);
      const enteringView = viewRefs.current.get(enteringKey);
      let secondFrame = 0;
      const firstFrame = window.requestAnimationFrame(() => {
        secondFrame = window.requestAnimationFrame(() => {
          enteringView?.removeAttribute("data-entering");
          focusView(enteringView);
        });
      });
      transitionTimerRef.current = setTimeout(() => {
        setRenderState((current) => current.transitionId === renderState.transitionId
          ? { ...current, renderedEntries: current.sourceEntries, enteringKey: null, exitingKey: null }
          : current);
      }, fallbackDuration);
      return () => {
        window.cancelAnimationFrame(firstFrame);
        window.cancelAnimationFrame(secondFrame);
        if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      };
    }

    if (exitingKey) {
      const target = focusTargets.current.get(exitingKey);
      const revealedView = activeKey ? viewRefs.current.get(activeKey) : undefined;
      let focusFrame = 0;
      const revealFrame = window.requestAnimationFrame(() => {
        focusFrame = window.requestAnimationFrame(() => {
          if (target?.isConnected) target.focus({ preventScroll: true });
          else focusView(revealedView);
        });
      });
      focusTargets.current.delete(exitingKey);
      transitionTimerRef.current = setTimeout(() => {
        setRenderState((current) => current.transitionId === renderState.transitionId
          ? { ...current, renderedEntries: current.sourceEntries, enteringKey: null, exitingKey: null }
          : current);
      }, fallbackDuration);
      return () => {
        window.cancelAnimationFrame(revealFrame);
        window.cancelAnimationFrame(focusFrame);
        if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      };
    }
  }, [activeKey, renderState.enteringKey, renderState.exitingKey, renderState.transitionId]);

  const context = React.useMemo<StackNavigatorContextValue>(() => ({ depth, canPop, pop }), [canPop, depth, pop]);

  return (
    <StackNavigatorContext.Provider value={context}>
      <div
        ref={rootRef}
        data-slot="stack-navigator"
        data-depth={depth}
        className={cn("relative isolate h-full min-h-0 overflow-hidden bg-background", className)}
        style={{ "--pwa-stack-transition-duration": `${fallbackDuration}ms`, ...style } as React.CSSProperties}
        onPointerDownCapture={(event) => {
          if (event.target instanceof HTMLElement) lastInteractionRef.current = { target: event.target, at: performance.now() };
          onPointerDownCapture?.(event);
        }}
        {...props}
      >
        {renderState.renderedEntries.map((entry, index) => {
          const entering = entry.key === renderState.enteringKey;
          const exiting = entry.key === renderState.exitingKey;
          const covered = entry.key !== activeKey;

          return (
            <section
              aria-hidden={covered || undefined}
              aria-label={entry.label}
              className={cn(
                "absolute inset-0 min-h-0 overflow-y-auto bg-background outline-none will-change-transform transition-[transform,opacity] duration-[var(--pwa-stack-transition-duration,280ms)] ease-out",
                "data-[entering]:translate-x-full data-[entering]:opacity-95 data-[exiting]:translate-x-full data-[exiting]:opacity-95",
                "data-[covered]:invisible data-[covered]:pointer-events-none data-[exiting]:visible",
                "motion-reduce:transition-none",
              )}
              data-covered={covered ? "" : undefined}
              data-entering={entering ? "" : undefined}
              data-exiting={exiting ? "" : undefined}
              data-slot="stack-view"
              data-view-key={entry.key}
              inert={covered || undefined}
              key={entry.key}
              ref={(node) => {
                if (node) viewRefs.current.set(entry.key, node);
                else viewRefs.current.delete(entry.key);
              }}
              role={entry.label ? "group" : undefined}
              style={{ zIndex: index + 1 }}
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
