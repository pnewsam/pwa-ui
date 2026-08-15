"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

type CodeBlockProps = {
  code: string;
  language?: string;
  label?: string;
  copyLabel?: string;
  compact?: boolean;
};

type CopyState = "idle" | "copied" | "failed";

export function CodeBlock({
  code,
  language = "tsx",
  label,
  copyLabel = "Copy code",
  compact = false,
}: CodeBlockProps) {
  const [copyState, setCopyState] = React.useState<CopyState>("idle");

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }

    window.setTimeout(() => setCopyState("idle"), 1600);
  }

  const copyText = copyState === "copied" ? "Copied" : copyState === "failed" ? "Try again" : "Copy";

  return (
    <div className={`code-block ${compact ? "is-compact" : ""}`}>
      <div className="code-block-toolbar">
        <span className={label ? "code-block-path" : undefined}>{label ?? language}</span>
        <button type="button" onClick={copyCode} aria-label={copyLabel}>
          {copyState === "copied" ? <Check size={14} /> : <Copy size={14} />}
          <span>{copyText}</span>
        </button>
      </div>
      <pre tabIndex={0}><code>{code}</code></pre>
    </div>
  );
}
