import * as React from "react";

import { cn } from "@/lib/utils";

export function NavigationBarRoot({ className, ...props }: React.ComponentPropsWithoutRef<"nav">) {
  return (
    <nav
      aria-label="Page navigation"
      data-slot="navigation-bar"
      className={cn(
        "grid min-h-[var(--pwa-navigation-bar-height,3.5rem)] grid-cols-[minmax(2.75rem,1fr)_minmax(0,auto)_minmax(2.75rem,1fr)] items-center border-b border-border/70 bg-background/92 px-2 backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  );
}

export function NavigationBarLeading({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return <div data-slot="navigation-bar-leading" className={cn("flex min-w-0 justify-self-start", className)} {...props} />;
}

export function NavigationBarTitle({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return <div data-slot="navigation-bar-title" className={cn("max-w-[min(60vw,22rem)] truncate text-center text-[0.95rem] font-semibold tracking-[-0.02em]", className)} {...props} />;
}

export function NavigationBarTrailing({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return <div data-slot="navigation-bar-trailing" className={cn("flex min-w-0 justify-self-end", className)} {...props} />;
}

export function NavigationBarBackButton({ className, children, ...props }: React.ComponentPropsWithoutRef<"button">) {
  return (
    <button
      type="button"
      data-slot="navigation-bar-back-button"
      className={cn("inline-flex min-h-11 min-w-11 items-center justify-center gap-1 rounded-xl text-sm font-medium outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring active:bg-accent/80", className)}
      {...props}
    >
      {children ?? <span aria-hidden="true" className="text-2xl leading-none">‹</span>}
    </button>
  );
}

export const NavigationBar = Object.assign(NavigationBarRoot, {
  Leading: NavigationBarLeading,
  Title: NavigationBarTitle,
  Trailing: NavigationBarTrailing,
  BackButton: NavigationBarBackButton,
});
