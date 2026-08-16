import * as React from "react";
import { useRender } from "@base-ui/react/use-render";

import { cn } from "@/lib/utils";

export function NavigationBarRoot({ className, ...props }: React.ComponentPropsWithoutRef<"nav">) {
  return (
    <nav
      aria-label="Page navigation"
      data-slot="navigation-bar"
      className={cn(
        "grid min-h-[var(--pwa-navigation-bar-height,3.5rem)] grid-cols-[minmax(2.75rem,1fr)_minmax(0,auto)_minmax(2.75rem,1fr)] items-center border-b border-border/70 bg-background/94 px-2.5 backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  );
}

export function NavigationBarLeading({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return <div data-slot="navigation-bar-leading" className={cn("flex min-w-0 items-center gap-1 justify-self-start", className)} {...props} />;
}

export function NavigationBarTitle({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return <div data-slot="navigation-bar-title" className={cn("max-w-[min(60vw,22rem)] truncate text-center text-[0.95rem] font-medium tracking-[-0.015em]", className)} {...props} />;
}

export function NavigationBarTrailing({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return <div data-slot="navigation-bar-trailing" className={cn("flex min-w-0 items-center gap-1 justify-self-end", className)} {...props} />;
}

export type NavigationBarBackButtonProps = Omit<useRender.ComponentProps<"button">, "ref"> & {
  ref?: React.Ref<HTMLElement>;
};

export function NavigationBarBackButton({ className, children, render, ref, ...props }: NavigationBarBackButtonProps) {
  return useRender<Record<string, never>, HTMLElement>({
    defaultTagName: "button",
    render,
    ref,
    props: {
      ...(render ? {} : { type: "button" }),
      ...props,
      "aria-label": props["aria-label"] ?? (children == null ? "Back" : undefined),
      "data-slot": "navigation-bar-back-button",
      className: cn("inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-1 rounded-[0.625rem] text-sm font-medium outline-none transition-[background-color,color,transform] duration-150 ease-out hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] active:bg-accent/80 disabled:pointer-events-none disabled:opacity-45", className),
      children: children ?? <span aria-hidden="true" className="text-2xl leading-none">‹</span>,
    },
  });
}

export const NavigationBar = Object.assign(NavigationBarRoot, {
  Leading: NavigationBarLeading,
  Title: NavigationBarTitle,
  Trailing: NavigationBarTrailing,
  BackButton: NavigationBarBackButton,
});
