import * as React from "react";

import { cn } from "@/lib/utils";

type SafeAreaEdge = "top" | "right" | "bottom" | "left";

export type SafeAreaProps = React.ComponentPropsWithoutRef<"div"> & {
  edges?: readonly SafeAreaEdge[];
};

const insets: Record<SafeAreaEdge, string> = {
  top: "var(--pwa-safe-top, env(safe-area-inset-top, 0px))",
  right: "var(--pwa-safe-right, env(safe-area-inset-right, 0px))",
  bottom: "var(--pwa-safe-bottom, env(safe-area-inset-bottom, 0px))",
  left: "var(--pwa-safe-left, env(safe-area-inset-left, 0px))",
};

export function SafeArea({
  edges = ["top", "right", "bottom", "left"],
  className,
  style,
  ...props
}: SafeAreaProps) {
  const edgeSet = new Set(edges);

  return (
    <div
      data-slot="safe-area"
      className={cn("box-border", className)}
      style={{
        paddingTop: edgeSet.has("top") ? insets.top : undefined,
        paddingRight: edgeSet.has("right") ? insets.right : undefined,
        paddingBottom: edgeSet.has("bottom") ? insets.bottom : undefined,
        paddingLeft: edgeSet.has("left") ? insets.left : undefined,
        ...style,
      }}
      {...props}
    />
  );
}
