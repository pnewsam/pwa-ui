import type { HTMLAttributes } from "react";

type PwaReadyProps = HTMLAttributes<HTMLDivElement> & {
  label?: string;
};

export function PwaReady({
  className = "",
  label = "Registry connected",
  ...props
}: PwaReadyProps) {
  return (
    <div
      className={`inline-flex min-h-11 items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 text-sm font-medium text-emerald-700 dark:text-emerald-300 ${className}`}
      role="status"
      {...props}
    >
      <span
        aria-hidden="true"
        className="size-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_color-mix(in_oklab,#10b981_16%,transparent)]"
      />
      {label}
    </div>
  );
}
