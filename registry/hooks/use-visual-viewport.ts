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

const minimumKeyboardHeight = 80;
let state = serverState;
let largestViewportHeight = 0;
let frame = 0;
let listening = false;
const subscribers = new Set<() => void>();

function isEditableElement(element: Element | null) {
  if (!(element instanceof HTMLElement)) return false;
  if (element.isContentEditable) return true;
  return element instanceof HTMLTextAreaElement || (
    element instanceof HTMLInputElement &&
    !["button", "checkbox", "color", "file", "hidden", "image", "radio", "range", "reset", "submit"].includes(element.type)
  );
}

function readViewport(resetBaseline = false): VisualViewportState {
  if (typeof window === "undefined") return serverState;

  const viewport = window.visualViewport;
  const width = viewport?.width ?? window.innerWidth;
  const height = viewport?.height ?? window.innerHeight;
  const offsetTop = viewport?.offsetTop ?? 0;
  const offsetLeft = viewport?.offsetLeft ?? 0;
  const scale = viewport?.scale ?? 1;
  const editing = isEditableElement(document.activeElement);

  if (resetBaseline || !largestViewportHeight) {
    largestViewportHeight = Math.max(window.innerHeight, height);
  } else if (!editing && Math.abs(scale - 1) < 0.01) {
    largestViewportHeight = Math.max(largestViewportHeight, window.innerHeight, height);
  }

  const occludedHeight = editing && Math.abs(scale - 1) < 0.01
    ? Math.max(0, largestViewportHeight - height)
    : 0;

  return {
    width,
    height,
    offsetTop,
    offsetLeft,
    scale,
    keyboardHeight: occludedHeight >= minimumKeyboardHeight ? occludedHeight : 0,
    supported: Boolean(viewport),
  };
}

function statesMatch(a: VisualViewportState, b: VisualViewportState) {
  return a.width === b.width &&
    a.height === b.height &&
    a.offsetTop === b.offsetTop &&
    a.offsetLeft === b.offsetLeft &&
    a.scale === b.scale &&
    a.keyboardHeight === b.keyboardHeight &&
    a.supported === b.supported;
}

function publish(resetBaseline = false) {
  window.cancelAnimationFrame(frame);
  frame = window.requestAnimationFrame(() => {
    const nextState = readViewport(resetBaseline);
    if (statesMatch(state, nextState)) return;
    state = nextState;
    subscribers.forEach((subscriber) => subscriber());
  });
}

function schedulePublish() {
  publish();
}

function handleOrientationChange() {
  largestViewportHeight = 0;
  publish(true);
}

function startListening() {
  if (listening || typeof window === "undefined") return;
  listening = true;
  state = readViewport();
  const viewport = window.visualViewport;
  viewport?.addEventListener("resize", schedulePublish);
  viewport?.addEventListener("scroll", schedulePublish);
  window.addEventListener("resize", schedulePublish);
  window.addEventListener("orientationchange", handleOrientationChange);
  document.addEventListener("focusin", schedulePublish);
  document.addEventListener("focusout", schedulePublish);
}

function stopListening() {
  if (!listening || subscribers.size > 0 || typeof window === "undefined") return;
  listening = false;
  window.cancelAnimationFrame(frame);
  const viewport = window.visualViewport;
  viewport?.removeEventListener("resize", schedulePublish);
  viewport?.removeEventListener("scroll", schedulePublish);
  window.removeEventListener("resize", schedulePublish);
  window.removeEventListener("orientationchange", handleOrientationChange);
  document.removeEventListener("focusin", schedulePublish);
  document.removeEventListener("focusout", schedulePublish);
}

function subscribe(subscriber: () => void) {
  subscribers.add(subscriber);
  startListening();
  publish();
  return () => {
    subscribers.delete(subscriber);
    stopListening();
  };
}

function getSnapshot() {
  return state;
}

export function useVisualViewport(): VisualViewportState {
  return React.useSyncExternalStore(subscribe, getSnapshot, () => serverState);
}
