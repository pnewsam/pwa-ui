import * as React from "react";
import { useRender } from "@base-ui/react/use-render";

import { cn } from "@/lib/utils";

export function TabBarRoot({ className, ...props }: React.ComponentPropsWithoutRef<"nav">) {
  return (
    <nav
      aria-label="Primary"
      data-slot="tab-bar"
      className={cn("grid min-h-[var(--pwa-tab-bar-height,4rem)] auto-cols-fr grid-flow-col items-center gap-1 border-t border-border/70 bg-background/94 px-3 py-2 backdrop-blur-xl", className)}
      {...props}
    />
  );
}

export interface TabBarItemState extends Record<string, unknown> {
  active: boolean;
}

export type TabBarItemProps = Omit<useRender.ComponentProps<"button", TabBarItemState>, "children" | "className" | "ref"> & {
  className?: string | ((state: TabBarItemState) => string | undefined);
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: React.ReactNode;
  badgeLabel?: string;
  href?: string;
  ref?: React.Ref<HTMLElement>;
};

export function TabBarItem({ icon, label, active = false, badge, badgeLabel, href, render, ref, className, ...props }: TabBarItemProps) {
  const content = (
    <>
      <span className="relative flex size-5 shrink-0 items-center justify-center [&>svg]:size-full">
        {icon}
        {badge != null ? (
          <span className="absolute -right-2.5 -top-1 min-w-4 rounded-full bg-destructive px-1 text-center text-[0.6rem] font-bold leading-4 text-destructive-foreground">
            <span aria-hidden={badgeLabel ? true : undefined}>{badge}</span>
            {badgeLabel ? <span className="sr-only">{badgeLabel}</span> : null}
          </span>
        ) : null}
      </span>
      <span className="max-w-full truncate text-[0.65rem] font-medium leading-none">{label}</span>
    </>
  );
  const baseClassName = "relative flex min-h-12 min-w-[var(--pwa-touch-target,2.75rem)] cursor-pointer flex-col items-center justify-center gap-1 rounded-[0.625rem] px-2 py-1 text-muted-foreground outline-none transition-[background-color,color,transform] duration-150 ease-out hover:bg-accent/70 hover:text-foreground focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring active:scale-[0.98] active:bg-accent data-[active]:bg-accent/55 data-[active]:text-foreground disabled:pointer-events-none disabled:opacity-45 motion-reduce:transition-none motion-reduce:active:scale-100";
  const classes = cn(baseClassName, typeof className === "function" ? className({ active }) : className);

  return useRender<TabBarItemState, HTMLElement>({
    defaultTagName: href ? "a" : "button",
    render,
    ref,
    state: { active },
    props: {
      ...(render || href ? {} : { type: "button" }),
      ...(href ? { href } : {}),
      ...props,
      "aria-label": props["aria-label"] ?? (badgeLabel ? `${label}, ${badgeLabel}` : undefined),
      "aria-current": active ? "page" : undefined,
      "data-slot": "tab-bar-item",
      className: classes,
      children: content,
    },
  });
}

export const TabBar = Object.assign(TabBarRoot, { Item: TabBarItem });
