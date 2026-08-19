# Feature: PullToRefresh

## Contents

- Metadata
- Outcome and context
- Evidence or product alignment
- Acceptance criteria
- Technical notes and risks
- Verification and tasks
- Progress

## Metadata

- **ID:** 001
- **Mode:** product
- **Status:** in_progress
- **Created:** 2026-08-19
- **Last updated:** 2026-08-19
- **Owner:** maintainer (pnewsam)
- **Parent Epic:** [001-native-feel-layer](../epics/001-native-feel-layer.md)
- **Product Basis:** [CHARTER.md](../CHARTER.md) principle 3 (phone-first) and 4 (platform features over device detection); epic goal 2 (physics layer).

## Outcome

A `pull-to-refresh` registry item: a touch-driven refresh control that composes with `AppShell.Main` and arbitrary scroll containers, installable via `@pwa-ui/pull-to-refresh`, with docs, tests, and device-QA criteria.

## Context

Installed apps refresh lists by pulling down; web apps usually cannot without hijacking scroll. iOS Safari offers native pull-to-refresh only as a page reload in browser mode and nothing in standalone mode, which is exactly where PWA UI apps live. The existing shell already sets `overscroll-contain` on `AppShell.Main` ([app-shell.tsx](../../registry/components/app-shell/app-shell.tsx)), which is the correct base for a custom gesture. No current registry item covers this.

## Product Alignment

- **User story:** As a developer building an app-like PWA, I want a drop-in pull-to-refresh region so that my list screens refresh the way installed apps do, without me writing gesture code.
- **Epic goal advanced:** Goal 2 — ship the small-physics layer as independently installable registry items.
- **Charter principle advanced:** Phone-first interaction; Pointer Events over device detection; no new runtime dependency.
- **Relevant non-goal:** No data-fetching ownership — the component calls a consumer-supplied `onRefresh` and renders state; it never fetches.

## Acceptance Criteria

### Must Have

- [x] `PullToRefresh` component exists at `registry/components/pull-to-refresh/pull-to-refresh.tsx` with props: `onRefresh: () => void | Promise<void>`, `disabled?: boolean`, `threshold?: number` (default ≈ 70px), `maxPull?: number`, and standard `className`/`children` passthrough.
- [x] The gesture arms only when the wrapped scroll container is at `scrollTop <= 0`; otherwise native scrolling is completely untouched (no `preventDefault`, no transform).
- [x] Pull distance follows a resistance curve (pull feels progressively heavier) and is published as `--pwa-pull-distance` on the component root; visual state is exposed via `data-state="idle" | "pulling" | "armed" | "refreshing"` for consumer styling.
- [x] Releasing past the threshold calls `onRefresh` exactly once, holds the indicator visible until the returned promise settles, then retracts; releasing before the threshold retracts without calling `onRefresh`.
- [x] A default spinner indicator ships in the component (consumers can replace it via an `indicator` prop or slot); it announces refresh state to assistive technology (`role="status"`, polite live region) and respects `prefers-reduced-motion` (opacity change instead of rotation/translation).
- [x] Implementation uses Pointer Events with proper capture and cancellation (pointercancel, pointerleave), and applies `touch-action` such that vertical pan still works when the gesture is not armed. No user-agent sniffing.
- [x] Registry entry added to `registry/registry.json`; `pnpm registry:build` produces `r/pull-to-refresh.json` and `scripts/test-registry-install.mjs` passes for the new item.
- [ ] Docs entry in `apps/docs/lib/component-docs.ts` with a live example page, including a caveat section on platform behavior (browser-mode native pull-to-refresh, standalone mode, desktop no-op with mouse wheel).
- [x] Unit coverage in `apps/docs/test/components.test.tsx` and a Playwright fixture at `apps/docs/app/test-fixtures/pull-to-refresh/page.tsx` exercised by `tests/e2e/components.spec.ts` (synthetic pointer sequence: arm, pull past threshold, release, assert single `onRefresh` and state transitions).
- [ ] [DEVICE_QA.md](../DEVICE_QA.md) gains a pull-to-refresh section with concrete pass criteria (arming at top only, no scroll fight, standalone and browser mode).

### Should Have

- [x] `refreshing` controlled prop for consumers who manage refresh state externally.

## Out of Scope

- Horizontal or bidirectional swipe actions (swipe-to-delete etc.).
- Infinite scroll / load-more behavior.
- Mouse-drag pull on desktop (wheel/trackpad users get nothing; document this).
- Any change to `AppShell` itself beyond documentation of the composition.

## Technical Notes

- **Affected boundaries:** New registry component + entry; docs app pages/tests. No changes to existing components. Consumes `--pwa-*` token conventions; does not modify [pwa.css](../../registry/styles/pwa.css).
- **Dependencies:** None on other epic children. No new npm dependency — gesture is hand-rolled on Pointer Events (small, readable per charter principle 6; do not add a physics library).
- **Compatibility and rollout:** Additive item; beta status caveats apply as for other components.
- **Rollback or recovery:** Delete the registry item and docs entry; nothing else references it.
- Composition decision for the implementer: `PullToRefresh` wraps its own scroll viewport (it renders the scrollable element and the consumer nests content), OR attaches to a child `AppShell.Main` via a ref/`asChild`-style API. Prefer the first (own viewport) for correctness of `scrollTop` arming; document how it nests inside `AppShell.Main` with `overflow-y-auto` moved to the component. Record the decision and rationale in the docs page.

### UI and accessibility evidence when relevant

- **Canonical pattern or primitive:** iOS/Android list refresh control.
- **Affected variants and states:** idle, pulling, armed, refreshing, disabled, reduced motion.
- **Visual and accessibility checks:** live-region announcement test; reduced-motion assertion in e2e (emulate `prefers-reduced-motion`).

## Risks

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| Gesture fights native overscroll/rubber-banding on iOS | medium | high | Arm only at `scrollTop <= 0`; rely on existing `overscroll-contain`; verify in e2e with synthetic pointers and add explicit DEVICE_QA criteria for hardware verification |
| `preventDefault` on touch-derived pointer events fails to stop scroll on some browsers | medium | medium | Use `touch-action: pan-y`-aware design: set `touch-action: none` on the viewport only while armed via CSS class, test both paths |
| Promise-returning `onRefresh` that never settles wedges the indicator | low | medium | Optional `timeout` note in docs; state machine allows a second pull to reset after settle-or-error; errors settle the indicator and are rethrown to a console warning |

## Verification

- `pnpm check` (lint, types, unit) passes.
- `pnpm test:e2e` passes including the new pull-to-refresh spec.
- `pnpm registry:build` + `node scripts/test-registry-install.mjs` verify the payload installs into a clean project.
- Manual check in the docs example on a touch-emulated viewport (Playwright touch or devtools) recorded in the plan's Progress table.

## Definition of Done

- [ ] All must-have acceptance criteria pass.
- [ ] Required invariants and guardrails hold (native scroll untouched when not armed).
- [ ] Verification evidence is recorded.
- [ ] No unrelated changes are included.
- [ ] Relevant documentation is updated (component docs page, COMPONENTS.md, DEVICE_QA.md).

## Tasks

- [x] Implement `PullToRefresh` (component, state machine, indicator, CSS variable/data-state contract) with unit tests and the Playwright fixture + e2e spec passing; include the registry entry and registry install verification in the same commit.
- [ ] Add the docs page (`component-docs.ts` entry, live example, platform caveats), update `docs/COMPONENTS.md`, and add the DEVICE_QA.md section; run `pnpm check` and `pnpm test:e2e` and record evidence.

## Progress

| Criterion or task | Status | Evidence | Notes |
| --- | --- | --- | --- |
| Component, registry payload, tests, and clean install | complete | `pnpm --filter @pwa-ui/docs exec vitest run test/components.test.tsx`; `pnpm typecheck`; `pnpm registry:validate`; `pnpm registry:build`; focused Playwright spec in Chromium + WebKit; clean `@pwa-ui/pull-to-refresh` install | The component owns its scroll viewport so `scrollTop` arming and native-scroll pass-through have one reliable boundary. |
