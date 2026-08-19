# Feature: useHaptics

## Contents

- Metadata
- Outcome and context
- Evidence or product alignment
- Acceptance criteria
- Technical notes and risks
- Verification and tasks
- Progress

## Metadata

- **ID:** 003
- **Mode:** product
- **Status:** draft
- **Created:** 2026-08-19
- **Last updated:** 2026-08-19
- **Owner:** maintainer (pnewsam)
- **Parent Epic:** [001-native-feel-layer](../epics/001-native-feel-layer.md)
- **Product Basis:** [CHARTER.md](../CHARTER.md) principle 5 (honest about the platform ceiling); epic goal 2 (physics layer).

## Outcome

A `use-haptics` registry hook exposing capability-detected haptic feedback with a small set of named presets, an honest `supported` flag, and documentation that states exactly where it works and where it is a no-op.

## Context

Tactile feedback on tap, success, and error is part of why installed apps feel physical. The web has one narrow primitive — `navigator.vibrate` — supported on Android Chrome but not iOS Safari. The honest move (per the charter) is a tiny hook that makes the capability trivial to use where it exists, never throws where it does not, and documents the iOS gap instead of hiding it. This is deliberately the smallest child of the epic.

## Product Alignment

- **User story:** As a developer, I want `haptics.tap()` on button presses and destructive confirmations so that Android users get native-feeling feedback, without writing capability checks or breaking iOS.
- **Epic goal advanced:** Goal 2 — physics layer.
- **Charter principle advanced:** Honest platform limitations; platform features over device detection (pure feature detection of `navigator.vibrate`, no UA sniffing).
- **Relevant non-goal:** No attempt to emulate haptics via audio or other hacks; no dependency on nonstandard APIs.

## Acceptance Criteria

### Must Have

- [ ] `useHaptics` hook exists at `registry/hooks/use-haptics.ts` returning `{ supported: boolean, vibrate(pattern: number | number[]): boolean, tap(): boolean, success(): boolean, warning(): boolean, error(): boolean }`, where presets map to short documented patterns (e.g. tap = 10ms; success = 10-40-20; warning = 30; error = 40-60-40 — final values chosen and documented by the implementer).
- [ ] `supported` is `false` and every method is a safe no-op returning `false` when `navigator.vibrate` is absent (iOS Safari, desktop Safari/Firefox where absent) or when the document is not allowed to vibrate; nothing ever throws.
- [ ] SSR-safe: `supported` is `false` on the server and resolves after mount, matching the `unknown`-then-resolve pattern of existing hooks.
- [ ] The hook respects user intent: methods called outside a user activation simply return `false` when the platform blocks them; docs state that calls should be tied to user gestures.
- [ ] No user-agent sniffing anywhere in the item.
- [ ] Registry entry in `registry/registry.json`; registry build + `scripts/test-registry-install.mjs` pass.
- [ ] Docs entry in `apps/docs/lib/hook-docs.ts` with a support-matrix table (Android Chrome: yes; iOS Safari: no; desktop: mostly no) and a live demo that shows `supported` and fires presets; the demo visibly communicates the no-op case rather than appearing broken.
- [ ] Unit tests in `apps/docs/test/hooks.test.tsx` covering supported/unsupported paths (mock `navigator.vibrate`), preset patterns, and SSR snapshot.
- [ ] `docs/COMPONENTS.md` lifecycle-hooks section mentions the hook with the same honesty.

### Should Have

- [ ] Guidance in the docs page on pairing with `TabBar`/`ActionSheet` (e.g. `tap()` on destructive `ActionSheet.Item`) — documentation only, no changes to those components.

## Out of Scope

- Wiring haptics into any existing registry component.
- Audio/visual fallbacks for unsupported platforms.
- The iOS `input[switch]` haptic trick or other nonstandard workarounds.

## Technical Notes

- **Affected boundaries:** One new leaf hook + docs/tests. No component changes.
- **Dependencies:** None.
- **Compatibility and rollout:** Additive; trivially removable.
- **Rollback or recovery:** Delete the item.

## Risks

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| Developers over-fire vibration and it reads as spam | medium | low | Preset durations kept short; docs prescribe gesture-tied usage |
| `navigator.vibrate` returns true but device silently ignores (settings, low power) | medium | low | Document that the return value means "accepted", not "felt"; DEVICE_QA row for Android verification |

## Verification

- `pnpm check` passes with new unit coverage.
- Registry build + clean-install verification.
- Docs demo renders both supported and unsupported states (assert via e2e that the unsupported message shows when `navigator.vibrate` is absent).

## Definition of Done

- [ ] All must-have acceptance criteria pass.
- [ ] Required invariants and guardrails hold (never throws, no UA sniffing).
- [ ] Verification evidence is recorded.
- [ ] No unrelated changes are included.
- [ ] Relevant documentation is updated.

## Tasks

- [ ] Implement `use-haptics` with unit tests, registry entry, docs page with support matrix and demo, COMPONENTS.md note, and a DEVICE_QA.md row; run all checks and record evidence in one commit.

## Progress

| Criterion or task | Status | Evidence | Notes |
| --- | --- | --- | --- |
