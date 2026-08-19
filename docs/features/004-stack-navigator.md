# Feature: StackNavigator

## Contents

- Metadata
- Outcome and context
- Evidence or product alignment
- Acceptance criteria
- Technical notes and risks
- Verification and tasks
- Progress

## Metadata

- **ID:** 004
- **Mode:** product
- **Status:** in_progress
- **Created:** 2026-08-19
- **Last updated:** 2026-08-19
- **Owner:** maintainer (pnewsam)
- **Parent Epic:** [001-native-feel-layer](../epics/001-native-feel-layer.md)
- **Product Basis:** [CHARTER.md](../CHARTER.md) value proposition and principle 3; epic goal 1 (stack navigation). Constrained by the "no routing ownership" non-goal.

## Outcome

A `stack-navigator` registry item: a router-agnostic stacked-view container with animated push/pop (View Transitions where supported, CSS transform fallback elsewhere), preserved state and scroll on covered views, correct focus and accessibility semantics, and a NavigationBar back-button composition — installable, tested, and documented. The edge-swipe back gesture is explicitly a separate feature ([005](005-stack-back-gesture.md)).

## Context

This is the largest identified gap between "mobile chrome kit" and "native-feel kit" (project review, 2026-08-19). Native apps navigate as a stack: detail screens push over lists, back pops with a transition, and the covered screen keeps its state and scroll offset. The library currently ships `NavigationBar.BackButton` with no stack for it to act on. The React ecosystem has no lightweight router-agnostic option: router-level animation is framework-specific, and full solutions (Ionic, react-navigation) own routing wholesale — which the charter forbids. `document.startViewTransition` (same-document) is available in current Chrome and Safari and recent Firefox, making a thin primitive feasible now with a fallback for older engines.

## Product Alignment

- **User story:** As a developer, I want to push a detail view over a list with a native-style transition and pop back to an unchanged list so that navigation inside my PWA feels like an installed app.
- **Epic goal advanced:** Goal 1 — router-agnostic stacked navigation.
- **Charter principle advanced:** Behavior from platform primitives (View Transitions), phone-first, source the consumer can read and own.
- **Relevant non-goal:** The component never reads or writes URLs or `history`. The consumer decides what is on the stack; routers integrate by mapping their state to entries (guide-level docs only).

## Acceptance Criteria

### Must Have

- [x] `StackNavigator` exists at `registry/components/stack-navigator/stack-navigator.tsx` with a controlled API: `entries: { key: string; content: React.ReactNode }[]`, `onPop: (key: string) => void` (fired by internal back affordances), and no uncontrolled history of its own. A `useStackNavigator()` context hook exposes `{ depth, canPop, pop }` to descendants for back buttons.
- [x] Pushing (appending an entry) animates the new view in from the trailing edge; popping animates it out; the API remains correct if multiple entries change at once (animate only the top transition, snap the rest).
- [x] Views beneath the top remain mounted with DOM state and scroll preserved, are `inert` and hidden from the accessibility tree while covered, and become interactive again on pop. Verified by an e2e test that types into an input, scrolls the list, pushes, pops, and asserts both survived.
- [ ] Transitions use `document.startViewTransition` when available; otherwise a CSS transform/opacity fallback driven by `data-[entering]`/`data-[exiting]` attributes produces an equivalent (if simpler) motion. Feature detection only — no UA sniffing.
- [ ] `prefers-reduced-motion` disables sliding motion in both paths (cross-fade or instant swap), asserted in a test with emulated reduced motion.
- [x] Focus management: on push, focus moves into the new view (first autofocus element, else the view container with `tabindex="-1"`); on pop, focus returns to the element that triggered the push when it still exists, else the revealed view container. Keyboard-only traversal cannot reach covered views.
- [x] Styling follows library conventions: `data-slot` attributes, `--pwa-*` variables where sizing is exposed, works inside `AppShell.Main` and as a full-shell child; z-order plays correctly with `AppShell.Header`/`Footer` (top view slides under fixed chrome, matching native behavior).
- [x] Registry entry in `registry/registry.json` (component + any co-located hook file); registry build and `scripts/test-registry-install.mjs` pass.
- [ ] Docs: `component-docs.ts` entry with a live list→detail example composing `NavigationBar.BackButton` via `useStackNavigator`, a support-matrix note for View Transitions, and a guide section ("Stacked navigation") explaining router integration patterns (Next.js parallel/intercepted routes or state-driven stacks) as documentation only.
- [ ] Unit tests plus a Playwright fixture at `apps/docs/app/test-fixtures/stack-navigator/page.tsx` covering push/pop state, inert/focus behavior, fallback path (force-disable `startViewTransition` in one test), and reduced motion.
- [ ] [DEVICE_QA.md](../DEVICE_QA.md) gains a stacked-navigation section (transition smoothness, state preservation, focus, rotation mid-transition).

### Should Have

- [x] `onDepthChange` or equivalent callback so consumers can sync UI (e.g. hide `TabBar` when depth > 1) without reaching inside.

## Out of Scope

- Edge-swipe back gesture (feature 005).
- URL/history synchronization, route matching, deep linking — guide-level documentation only.
- Shared-element ("hero") transitions between views beyond default View Transitions crossfade/slide.
- Nested stacks and modal stack presentation (evaluate after v1 of the primitive).
- Tab-to-tab transitions.

## Technical Notes

- **Affected boundaries:** New registry component + docs/tests; `NavigationBar.BackButton` is composed via its existing `render` prop — no changes to it. Interacts visually with `AppShell`; no code changes there.
- **Dependencies:** None on other epic children; feature 005 depends on this. No new npm dependency — View Transitions and CSS handle the motion.
- **Compatibility and rollout:** Additive item; View Transitions support matrix documented (Chrome ≥111, Safari ≥18, Firefox ≥139 for same-document; fallback covers the rest).
- **Rollback or recovery:** Remove the item; feature 005 must not land before this is stable.
- Implementation notes for the executor: keep transition orchestration in a co-located `use-stack-transitions.ts` if the component file grows past readable size (charter principle 6). With View Transitions, assign `view-transition-name` only to the two participating views during the transition and remove after, to avoid global name collisions with consumer transitions. The fallback path should use a two-frame commit (mount hidden → apply entering attribute) to guarantee the transition runs. `inert` is baseline in all supported browsers.

### UI and accessibility evidence when relevant

- **Canonical pattern or primitive:** iOS `UINavigationController` / Android fragment back stack.
- **Affected variants and states:** entering, exiting, covered, revealed, reduced motion, no-View-Transitions fallback.
- **Visual and accessibility checks:** focus-order assertions; inert coverage; screen-reader name/role of view containers; e2e screenshots of mid-transition states optional.

## Risks

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| API drifts toward a router | medium | high | Controlled-entries-only API; review against the non-goal before merging; any URL-aware code is rejected at review |
| View Transitions capture whole-document snapshots and conflict with consumer transitions or fixed chrome | medium | medium | Scope `view-transition-name` to participating views; test with `AppShell` chrome present; document interop |
| Keeping covered views mounted grows memory on deep stacks | medium | low | Document depth expectations (mobile stacks are shallow); optional `unmountCovered` escape hatch deferred to follow-up work |
| Focus restoration target unmounts during the stay | medium | low | Fall back to revealed view container; test the fallback |
| Transition jank on low-end Android in fallback path | medium | medium | Transform/opacity only (compositor-friendly); no layout-affecting animation; DEVICE_QA criteria for hardware pass |

## Verification

- `pnpm check` and `pnpm test:e2e` pass, including forced-fallback and reduced-motion specs.
- Registry build + clean-install verification.
- Manual browser check of both transition paths in the docs example (Chrome for View Transitions, Firefox ESR or flag-disabled for fallback), evidence noted in Progress.

## Definition of Done

- [ ] All must-have acceptance criteria pass.
- [ ] Required invariants and guardrails hold (no routing ownership; covered-view state preserved).
- [ ] Verification evidence is recorded.
- [ ] No unrelated changes are included.
- [ ] Relevant documentation is updated (docs page, guide section, COMPONENTS.md, DEVICE_QA.md).

## Tasks

- [x] Implement the core `StackNavigator` with the controlled API, mounted/inert covered views, focus management, and the CSS fallback transition; land with unit tests, the Playwright fixture, e2e coverage of push/pop/inert/focus, and the registry entry verified by clean install.
- [ ] Add the View Transitions path with feature detection, scoped `view-transition-name` handling, reduced-motion behavior in both paths, and forced-fallback + reduced-motion e2e specs.
- [ ] Write the docs page and "Stacked navigation" guide (including `NavigationBar.BackButton` composition and router-integration patterns as docs only), update `docs/COMPONENTS.md` and DEVICE_QA.md, run full checks, and record evidence.

## Progress

| Criterion or task | Status | Evidence | Notes |
| --- | --- | --- | --- |
| Controlled stack core, fallback motion, mounted/inert views, focus, registry payload, and tests | complete | focused component unit suite (21 passed); focused Playwright spec in Chromium + WebKit; `pnpm lint`; `pnpm typecheck`; `pnpm registry:validate`; `pnpm registry:build`; clean `@pwa-ui/stack-navigator` install | The component retains only the prior top during pop, snaps intermediate entries on multi-entry changes, and records recent pointer triggers so WebKit can restore focus even though pointer-clicked buttons do not receive focus there. |
