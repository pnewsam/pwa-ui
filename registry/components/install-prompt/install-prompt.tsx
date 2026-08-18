"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type InstallPromptProps = Omit<React.ComponentPropsWithoutRef<"section">, "title"> & {
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  actionLabel?: string;
  dismissLabel?: string;
  installing?: boolean;
  steps?: readonly React.ReactNode[];
  onDismiss?: () => void;
} & (
  | { mode?: "prompt"; onInstall: () => void }
  | { mode: "manual"; onInstall?: never }
);

const defaultSteps = ["Open the browser share menu.", "Choose Add to Home Screen.", "Confirm with Add."];

export function InstallPrompt({
  title = "Install this app",
  description,
  icon,
  actionLabel = "Install",
  dismissLabel = "Not now",
  installing = false,
  mode = "prompt",
  steps = defaultSteps,
  onInstall,
  onDismiss,
  className,
  ...props
}: InstallPromptProps) {
  const titleId = React.useId();
  const descriptionId = React.useId();
  const manual = mode === "manual";
  const resolvedDescription = description ?? (manual
    ? "This browser installs from its own share menu. Follow these steps to add the app to your Home Screen."
    : "Add it to your device for quicker access and a focused app window.");

  return (
    <section
      data-slot="install-prompt"
      data-mode={mode}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className={cn("flex items-start gap-3 rounded-2xl border border-border/70 bg-background p-4 shadow-sm", className)}
      {...props}
    >
      {icon ? <div data-slot="install-prompt-icon" className="grid size-10 shrink-0 place-items-center rounded-xl bg-muted text-foreground [&>svg]:size-5">{icon}</div> : null}
      <div className="min-w-0 flex-1">
        <h2 id={titleId} className="text-sm font-semibold tracking-[-0.01em]">{title}</h2>
        <p id={descriptionId} className="mt-1 text-sm leading-5 text-muted-foreground">{resolvedDescription}</p>
        {manual ? (
          <ol data-slot="install-prompt-steps" className="mt-3 list-decimal space-y-1 pl-5 text-sm leading-5 text-foreground">
            {steps.map((step, index) => <li key={index}>{step}</li>)}
          </ol>
        ) : null}
        {manual && !onDismiss ? null : (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {manual ? null : (
              <button type="button" disabled={installing} onClick={onInstall} className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground outline-none transition-[opacity,transform] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55 motion-reduce:transition-none motion-reduce:active:scale-100">
                {installing ? "Opening…" : actionLabel}
              </button>
            )}
            {onDismiss ? <button type="button" disabled={installing} onClick={onDismiss} className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl px-4 text-sm font-medium text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-55 motion-reduce:transition-none">{dismissLabel}</button> : null}
          </div>
        )}
      </div>
    </section>
  );
}
