"use client";

import * as React from "react";

import { useVisualViewport } from "@/hooks/use-visual-viewport";

export type PWAProviderProps = {
  children: React.ReactNode;
};

const managedProperties = [
  "--pwa-keyboard-height",
  "--pwa-visual-viewport-height",
  "--pwa-viewport-height",
] as const;

export function PWAProvider({ children }: PWAProviderProps) {
  const viewport = useVisualViewport();

  React.useEffect(() => {
    const root = document.documentElement;
    const previousValues = new Map(
      managedProperties.map((property) => [property, root.style.getPropertyValue(property)]),
    );
    const hadKeyboardAttribute = root.hasAttribute("data-pwa-keyboard-open");

    return () => {
      previousValues.forEach((value, property) => {
        if (value) root.style.setProperty(property, value);
        else root.style.removeProperty(property);
      });
      if (!hadKeyboardAttribute) root.removeAttribute("data-pwa-keyboard-open");
    };
  }, []);

  React.useEffect(() => {
    if (!viewport.height) return;
    const root = document.documentElement;
    root.style.setProperty("--pwa-keyboard-height", `${viewport.keyboardHeight}px`);
    root.style.setProperty("--pwa-visual-viewport-height", `${viewport.height}px`);
    root.style.setProperty("--pwa-viewport-height", `${viewport.height}px`);
    root.toggleAttribute("data-pwa-keyboard-open", viewport.keyboardHeight > 0);
  }, [viewport.height, viewport.keyboardHeight]);

  return <>{children}</>;
}
