"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useVisualViewport } from "@/hooks/use-visual-viewport";

export type KeyboardAvoidingViewProps = React.ComponentPropsWithoutRef<"div"> & {
  behavior?: "padding" | "height" | "position";
  keyboardOffset?: number;
};

export function KeyboardAvoidingView({
  behavior = "padding",
  keyboardOffset = 0,
  className,
  style,
  ...props
}: KeyboardAvoidingViewProps) {
  const viewport = useVisualViewport();
  const keyboardHeight = Math.max(0, viewport.keyboardHeight - keyboardOffset);
  const variables = {
    "--pwa-keyboard-height": `${keyboardHeight}px`,
    "--pwa-visual-viewport-height": viewport.height ? `${viewport.height}px` : "100dvh",
  } as React.CSSProperties;

  const behaviorStyle: React.CSSProperties =
    behavior === "height"
      ? { height: "var(--pwa-visual-viewport-height, 100dvh)" }
      : behavior === "position"
        ? { transform: "translateY(calc(var(--pwa-keyboard-height, 0px) * -1))" }
        : { paddingBottom: "var(--pwa-keyboard-height, 0px)" };

  return (
    <div
      data-keyboard-open={keyboardHeight > 0 ? "" : undefined}
      data-slot="keyboard-avoiding-view"
      className={cn(className)}
      style={{ ...variables, ...behaviorStyle, ...style }}
      {...props}
    />
  );
}
