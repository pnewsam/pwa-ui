import * as React from "react";

import { cn } from "@/lib/utils";

export function TabBarRoot({ className, ...props }: React.ComponentPropsWithoutRef<"nav">) {
  return (
    <nav
      aria-label="Primary"
      data-slot="tab-bar"
      className={cn("grid min-h-[var(--pwa-tab-bar-height,4rem)] auto-cols-fr grid-flow-col items-stretch border-t border-border/70 bg-background/94 px-1 backdrop-blur-xl", className)}
      {...props}
    />
  );
}

export type TabBarItemProps = Omit<React.ComponentPropsWithoutRef<"button">, "children"> & {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: React.ReactNode;
  href?: string;
};

export function TabBarItem({ icon, label, active, badge, href, className, ...props }: TabBarItemProps) {
  const content = (
    <>
      <span className="relative">
        {icon}
        {badge != null ? <span className="absolute -right-2.5 -top-1 min-w-4 rounded-full bg-destructive px-1 text-center text-[0.6rem] font-bold leading-4 text-white">{badge}</span> : null}
      </span>
      <span className="max-w-full truncate text-[0.65rem] font-medium leading-none">{label}</span>
    </>
  );
  const classes = cn(
    "relative flex min-h-14 min-w-11 flex-col items-center justify-center gap-1 rounded-xl px-2 text-muted-foreground outline-none transition-colors hover:bg-accent/70 hover:text-foreground focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring active:bg-accent data-[active]:text-primary",
    className,
  );

  if (href) {
    return <a href={href} aria-current={active ? "page" : undefined} data-active={active ? "" : undefined} data-slot="tab-bar-item" className={classes}>{content}</a>;
  }

  return <button type="button" aria-current={active ? "page" : undefined} data-active={active ? "" : undefined} data-slot="tab-bar-item" className={classes} {...props}>{content}</button>;
}

export const TabBar = Object.assign(TabBarRoot, { Item: TabBarItem });
