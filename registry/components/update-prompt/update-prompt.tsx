"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type UpdatePromptProps = Omit<React.ComponentPropsWithoutRef<"section">, "title"> & {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actionLabel?: string;
  dismissLabel?: string;
  updating?: boolean;
  onUpdate: () => void;
  onDismiss?: () => void;
};

export function UpdatePrompt({
  title = "An update is ready",
  description = "Reload to use the latest version of the app.",
  actionLabel = "Update now",
  dismissLabel = "Later",
  updating = false,
  onUpdate,
  onDismiss,
  className,
  ...props
}: UpdatePromptProps) {
  const titleId = React.useId();
  const descriptionId = React.useId();

  return (
    <section
      data-slot="update-prompt"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className={cn("flex flex-col gap-3 rounded-2xl border border-border/70 bg-background p-4 shadow-sm sm:flex-row sm:items-center", className)}
      {...props}
    >
      <div className="min-w-0 flex-1">
        <h2 id={titleId} className="text-sm font-semibold tracking-[-0.01em]">{title}</h2>
        <p id={descriptionId} role="status" aria-live="polite" className="mt-1 text-sm leading-5 text-muted-foreground">{updating ? "Applying the update…" : description}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {onDismiss ? <button type="button" disabled={updating} onClick={onDismiss} className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl px-4 text-sm font-medium text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-55 motion-reduce:transition-none">{dismissLabel}</button> : null}
        <button type="button" disabled={updating} onClick={onUpdate} className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground outline-none transition-[opacity,transform] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70 motion-reduce:transition-none motion-reduce:active:scale-100">
          {updating ? <span aria-hidden="true" className="size-4 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none" data-slot="update-prompt-spinner" /> : null}
          {updating ? "Updating…" : actionLabel}
        </button>
      </div>
    </section>
  );
}
