"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { Highlight, type PrismTheme } from "prism-react-renderer";

type CodeBlockProps = {
  code: string;
  language?: string;
  label?: string;
  toolbarStart?: React.ReactNode;
  copyLabel?: string;
  compact?: boolean;
};

type CopyState = "idle" | "copied" | "failed";

const docsCodeTheme: PrismTheme = {
  plain: {
    backgroundColor: "#18181b",
    color: "#d4d4d8",
  },
  styles: [
    { types: ["comment", "prolog", "doctype", "cdata"], style: { color: "#a1a1aa", fontStyle: "italic" } },
    { types: ["punctuation"], style: { color: "#a1a1aa" } },
    { types: ["namespace"], style: { color: "#d4d4d8", opacity: 0.75 } },
    { types: ["property", "tag", "constant", "symbol", "deleted"], style: { color: "#f0abfc" } },
    { types: ["boolean", "number"], style: { color: "#f9a8d4" } },
    { types: ["selector", "attr-name", "string", "char", "builtin", "inserted"], style: { color: "#a7f3d0" } },
    { types: ["operator", "entity", "url", "string-operator"], style: { color: "#c4b5fd" } },
    { types: ["atrule", "attr-value", "keyword"], style: { color: "#c4b5fd" } },
    { types: ["function", "class-name"], style: { color: "#93c5fd" } },
    { types: ["regex", "important", "variable"], style: { color: "#fcd34d" } },
  ],
};

function normalizeLanguage(language: string) {
  if (["sh", "shell", "zsh"].includes(language)) return "bash";
  if (language === "typescript") return "ts";
  return language;
}

export function CodeBlock({
  code,
  language = "tsx",
  label,
  toolbarStart,
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
        {toolbarStart ?? <span className={label ? "code-block-path" : undefined}>{label ?? language}</span>}
        <button type="button" onClick={copyCode} aria-label={copyLabel}>
          {copyState === "copied" ? <Check size={14} /> : <Copy size={14} />}
          <span>{copyText}</span>
        </button>
      </div>
      <Highlight theme={docsCodeTheme} code={code} language={normalizeLanguage(language)}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre tabIndex={0} className={className} style={style}>
            <code>
              {tokens.map((line, lineIndex) => {
                const lineProps = getLineProps({ line });
                return (
                  <span
                    {...lineProps}
                    className={`${lineProps.className} code-line`}
                    key={lineIndex}
                  >
                    {line.map((token, tokenIndex) => (
                      <span {...getTokenProps({ token })} key={tokenIndex} />
                    ))}
                  </span>
                );
              })}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  );
}
