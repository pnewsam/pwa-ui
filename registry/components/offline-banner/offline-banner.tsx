import * as React from "react";

import { cn } from "@/lib/utils";

export type OfflineBannerProps = React.ComponentPropsWithoutRef<"div"> & {
  action?: React.ReactNode;
};

export function OfflineBanner({
  children = "You're offline. Some information may be out of date.",
  action,
  className,
  ...props
}: OfflineBannerProps) {
  return (
    <div
      data-slot="offline-banner"
      role="status"
      aria-live="polite"
      className={cn("flex min-h-11 items-center justify-center gap-2 border-b border-border/70 bg-muted px-4 py-2 text-center text-sm text-muted-foreground", className)}
      {...props}
    >
      <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-muted-foreground" />
      <span>{children}</span>
      {action ? <span data-slot="offline-banner-action" className="ml-1 shrink-0 font-medium text-foreground [&>a]:underline [&>button]:cursor-pointer [&>button]:underline">{action}</span> : null}
    </div>
  );
}
