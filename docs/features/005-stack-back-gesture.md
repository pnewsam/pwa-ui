# Feature: Stack back gesture

## Contents

- Metadata
- Outcome and context
- Evidence or product alignment
- Acceptance criteria
- Technical notes and risks
- Verification and tasks
- Progress

## Metadata

- **ID:** 005
- **Mode:** product
- **Status:** in_progress
- **Created:** 2026-08-19
- **Last updated:** 2026-08-19
- **Owner:** maintainer (pnewsam)
- **Parent Epic:** [001-native-feel-layer](../epics/001-native-feel-layer.md)
- **Product Basis:** [CHARTER.md](../CHARTER.md) principles 3 and 4; epic goal 1. Depends on feature [004-stack-navigator](004-stack-navigator.md).

## Outcome

An opt-in edge-swipe back gesture for `StackNavigator`: dragging from the leading edge tracks the top view with the finger (previous view revealed with parallax), releasing past a threshold pops, releasing before it springs back — with explicit, tested conflict policy against browser and OS edge gestures.

## Context

Gesture-driven back with live progress is the single most recognizable "installed app" interaction on iOS. Feature 004 delivers push/pop as discrete transitions; this feature makes pop continuous. It is deliberately separated because the risk profile is different: the transition work is safe everywhere, while edge gestures collide with Safari's own back-swipe in browser tabs and with OS navigation gestures, so this layer must be display-mode-aware and easy to disable.

## Product Alignment

- **User story:** As a user of an installed PWA built with StackNavigator, I want to swipe from the left edge to go back, with the page following my finger, so that navigation feels physically native.
- **Epic goal advanced:** Goal 1 — stacked navigation with edge-swipe back.
- **Charter principle advanced:** Pointer Events over device detection; honest platform limitations (the gesture is default-off where the platform already owns the edge).
- **Relevant non-goal:** No history/router integration; the gesture only drives `onPop` exactly like a back button.

## Acceptance Criteria

### Must Have

- [x] A `backGesture` capability on `StackNavigator` (prop, e.g. `backGesture?: "auto" | "on" | "off"`, default `"auto"`), implemented in a co-located file (e.g. `use-stack-back-gesture.ts`) so consumers who never enable it can delete the file cleanly.
- [ ] `"auto"` enables the gesture only when `display-mode` is `standalone` or `fullscreen` (via the existing `use-display-mode` hook / media query) — i.e. where the browser's own back-swipe is absent; `"on"`/`"off"` force it. Decision and rationale documented on the docs page.
- [x] Gesture recognition: a pointer-down within a configurable edge width (default 24px, respecting `--pwa-safe-left`) followed by horizontal movement claims the gesture; vertical-first movement or starts outside the edge zone never claim it, and scrolling inside the top view is unaffected (asserted in e2e).
- [x] While tracking, the top view translates with the pointer with 1:1 motion, the previous view reveals beneath (parallax at reduced ratio and a dimming scrim), progress is exposed as `--pwa-stack-swipe-progress` on the stack root, and no React re-render occurs per move event (transform applied via refs/CSS variables; verified by an implementation note and a render-count test).
- [x] Release past threshold (default: 50% width or a velocity flick) calls `onPop` with a completing animation from the current position; release before threshold animates the view back and does not pop. `pointercancel` always springs back safely.
- [x] Only the top view when `depth > 1` is draggable; the gesture is inert at depth 1.
- [x] `prefers-reduced-motion` keeps the gesture functional but completes with a fade/instant swap rather than sliding follow-through.
- [x] The gesture does not fire during an in-flight push/pop transition (states are mutually exclusive).
- [x] Ships in the same registry item as `stack-navigator` (payload update) — no separate install; registry build + clean-install verification pass.
- [x] E2E coverage in `tests/e2e/` using synthetic pointer sequences on the existing stack fixture: successful swipe-pop, sub-threshold spring-back, vertical-scroll non-capture, depth-1 inertness, and the `"off"` mode.
- [ ] Docs page section with the conflict-policy explanation (browser-mode Safari back-swipe, Android system back gesture) and DEVICE_QA.md rows for hardware verification of both display modes.

### Should Have

- [x] `onBackGestureStateChange` (or data-attribute equivalent) so consumers can dim custom chrome during a swipe.

## Out of Scope

- Right-edge/forward gestures, RTL mirroring (document as known follow-up; do not block on it — but note the decision explicitly in docs).
- Browser-history integration (Android hardware/gesture back triggering `onPop` is router territory; document the pattern only).
- Swipe-to-dismiss for sheets (Base UI Drawer already owns that).

## Technical Notes

- **Affected boundaries:** `registry/components/stack-navigator/` only, plus docs/tests. Uses `use-display-mode` (already in the registry) — declare it in `registryDependencies`.
- **Dependencies:** Feature 004 merged and stable. No new npm dependency; hand-rolled Pointer Events per charter.
- **Compatibility and rollout:** Additive prop, default `"auto"` is conservative; consumers on 004's initial release see no behavior change in browser tabs.
- **Rollback or recovery:** Setting `backGesture="off"` fully disables; the co-located hook file can be reverted independently of the core stack.
- Implementation notes: use `setPointerCapture` on the tracking element; apply `touch-action: pan-y` on the top view's gesture layer so vertical scroll is preserved while horizontal capture works; drive both views' transforms and scrim opacity from a single rAF writing CSS variables; on completion, hand off to the same pop pathway 004 uses so `onPop` semantics stay identical.

## Risks

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| Conflict with browser/OS edge gestures produces double-navigation | high | high | Default `"auto"` gates to standalone/fullscreen; DEVICE_QA rows for iOS standalone, iOS Safari browser mode, and Android gesture nav; document loudly |
| Gesture capture breaks horizontal scrollers/carousels near the edge | medium | medium | Edge-zone-only start, horizontal-intent detection, configurable edge width; e2e with a horizontal scroller in the fixture |
| Per-move work causes jank on low-end devices | medium | medium | CSS-variable/transform writes in one rAF, zero per-move React renders; compositor-only properties |
| iOS standalone gains a system back gesture in a future release | low | medium | `"auto"` policy is display-mode-based and can be revised in one place; documented as a policy, not a guarantee |

## Verification

- `pnpm check` and `pnpm test:e2e` pass including all new gesture specs.
- Registry build + clean-install verification of the updated `stack-navigator` payload.
- Manual touch-emulation pass over the docs example; evidence recorded in Progress.

## Definition of Done

- [ ] All must-have acceptance criteria pass.
- [ ] Required invariants and guardrails hold (no capture of vertical scroll; inert at depth 1; off in browser mode by default).
- [ ] Verification evidence is recorded.
- [ ] No unrelated changes are included.
- [ ] Relevant documentation is updated (docs section, DEVICE_QA.md).

## Tasks

- [x] Implement the gesture layer (recognition, tracking, thresholds, spring-back, display-mode gating, reduced-motion behavior) inside the stack-navigator item with e2e specs for capture, pop, spring-back, and non-interference passing.
- [ ] Update the docs page with the conflict policy and configuration guidance, add DEVICE_QA.md rows, update the registry payload with `use-display-mode` dependency, run full checks, and record evidence.

## Progress

| Criterion or task | Status | Evidence | Notes |
| --- | --- | --- | --- |
| Gesture recognition, physical tracking, policy gating, settling, and registry payload | complete | component unit suite (24 tests; 39 total with hooks); focused Playwright gesture suite (8 passed across Chromium and WebKit); registry validation/build; clean local `@pwa-ui/stack-navigator` install with `use-display-mode` | Pointer moves write three root CSS variables in one animation frame and do not update React state; gesture commits bypass the discrete pop animation to prevent a double transition. `data-back-gesture-state` and the callback expose idle/tracking/completing/canceling changes. |
