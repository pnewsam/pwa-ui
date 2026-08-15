import * as React from "react";

import { cn } from "@/lib/utils";

export function AppShellRoot({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="app-shell"
      className={cn(
        "isolate flex h-[var(--pwa-viewport-height,100dvh)] min-h-[100svh] w-full flex-col overflow-hidden bg-background text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function AppShellHeader({ className, style, ...props }: React.ComponentPropsWithoutRef<"header">) {
  return (
    <header
      data-slot="app-shell-header"
      className={cn("z-20 shrink-0", className)}
      style={{ paddingTop: "var(--pwa-safe-top, env(safe-area-inset-top, 0px))", ...style }}
      {...props}
    />
  );
}

export function AppShellMain({ className, ...props }: React.ComponentPropsWithoutRef<"main">) {
  return (
    <main
      data-slot="app-shell-main"
      className={cn("min-h-0 flex-1 overflow-y-auto overscroll-contain", className)}
      {...props}
    />
  );
}

export function AppShellFooter({ className, style, ...props }: React.ComponentPropsWithoutRef<"footer">) {
  return (
    <footer
      data-slot="app-shell-footer"
      className={cn("z-20 shrink-0", className)}
      style={{ paddingBottom: "var(--pwa-safe-bottom, env(safe-area-inset-bottom, 0px))", ...style }}
      {...props}
    />
  );
}

export const AppShell = Object.assign(AppShellRoot, {
  Header: AppShellHeader,
  Main: AppShellMain,
  Footer: AppShellFooter,
});
