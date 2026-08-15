"use client";

import * as React from "react";

export type VisualViewportState = {
  width: number;
  height: number;
  offsetTop: number;
  offsetLeft: number;
  scale: number;
  keyboardHeight: number;
  supported: boolean;
};

const serverState: VisualViewportState = {
  width: 0,
  height: 0,
  offsetTop: 0,
  offsetLeft: 0,
  scale: 1,
  keyboardHeight: 0,
  supported: false,
};

function readViewport(): VisualViewportState {
  if (typeof window === "undefined") return serverState;

  const viewport = window.visualViewport;
  if (!viewport) {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      offsetTop: 0,
      offsetLeft: 0,
      scale: 1,
      keyboardHeight: 0,
      supported: false,
    };
  }

  const keyboardHeight = Math.max(
    0,
    window.innerHeight - viewport.height - viewport.offsetTop,
  );

  return {
    width: viewport.width,
    height: viewport.height,
    offsetTop: viewport.offsetTop,
    offsetLeft: viewport.offsetLeft,
    scale: viewport.scale,
    keyboardHeight: keyboardHeight > 80 ? keyboardHeight : 0,
    supported: true,
  };
}

export function useVisualViewport(): VisualViewportState {
  const [state, setState] = React.useState<VisualViewportState>(serverState);

  React.useEffect(() => {
    const viewport = window.visualViewport;
    let frame = 0;
    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => setState(readViewport()));
    };

    update();
    viewport?.addEventListener("resize", update);
    viewport?.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);

    return () => {
      window.cancelAnimationFrame(frame);
      viewport?.removeEventListener("resize", update);
      viewport?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return state;
}
