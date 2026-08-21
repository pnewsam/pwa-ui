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
- **Status:** complete
- **Created:** 2026-08-19
- **Last updated:** 2026-08-19
- **Owner:** maintainer (pnewsam)
- **Parent Epic:** [001-native-feel-layer](../epics/001-native-feel-layer.md)
- **Product Basis:** [CHARTER.md](../CHARTER.md) value proposition and principle 3; epic goal 1 (stack navigation). Constrained by the "no routing ownership" non-goal.

## Outcome

A `stack-navigator` registry item: a router-agnostic stacked-view container with interruptible transform-only push/pop motion, preserved state and scroll on covered views, correct focus and accessibility semantics, and a NavigationBar back-button composition — installable, tested, and documented. The edge-swipe back gesture is explicitly a separate feature ([005](005-stack-back-gesture.md)).

## Context

This is the largest identified gap between "mobile chrome kit" and "native-feel kit" (project review, 2026-08-19). Native apps navigate as a stack: detail screens push over lists, back pops with a transition, and the covered screen keeps its state and scroll offset. The library currently ships `NavigationBar.BackButton` with no stack for it to act on. The React ecosystem has no lightweight router-agnostic option: router-level animation is framework-specific, and full solutions (Ionic, react-navigation) own routing wholesale — which the charter forbids. Because the component already retains its views, direct CSS transforms provide a smaller and more interruptible primitive than document snapshots.

## Product Alignment

- **User story:** As a developer, I want to push a detail view over a list with a native-style transition and pop back to an unchanged list so that navigation inside my PWA feels like an installed app.
- **Epic goal advanced:** Goal 1 — router-agnostic stacked navigation.
- **Charter principle advanced:** Behavior from platform primitives (CSS transforms), phone-first, source the consumer can read and own.
- **Relevant non-goal:** The component never reads or writes URLs or `history`. The consumer decides what is on the stack; routers integrate by mapping their state to entries (guide-level docs only).

## Acceptance Criteria

### Must Have

- [x] `StackNavigator` exists at `registry/components/stack-navigator/stack-navigator.tsx` with a controlled API: `entries: { key: string; content: React.ReactNode }[]`, `onPop: (key: string) => void` (fired by internal back affordances), and no uncontrolled history of its own. A `useStackNavigator()` context hook exposes `{ depth, canPop, pop }` to descendants for back buttons.
- [x] Pushing (appending an entry) animates the new view in from the trailing edge; popping animates it out; the API remains correct if multiple entries change at once (animate only the top transition, snap the rest).
- [x] Views beneath the top remain mounted with DOM state and scroll preserved, are `inert` and hidden from the accessibility tree while covered, and become interactive again on pop. Verified by an e2e test that types into an input, scrolls the list, pushes, pops, and asserts both survived.
- [x] Transitions animate the retained live views with transform-only CSS driven by entering, exiting, under, and revealing states. The motion is consistent across engines and can reverse without waiting for a document snapshot animation.
- [x] `prefers-reduced-motion` disables sliding motion in both paths (cross-fade or instant swap), asserted in a test with emulated reduced motion.
- [x] Focus management: on push, focus moves into the new view (first autofocus element, else the view container with `tabindex="-1"`); on pop, focus returns to the element that triggered the push when it still exists, else the revealed view container. Keyboard-only traversal cannot reach covered views.
- [x] Styling follows library conventions: `data-slot` attributes, `--pwa-*` variables where sizing is exposed, works inside `AppShell.Main` and as a full-shell child; z-order plays correctly with `AppShell.Header`/`Footer` (top view slides under fixed chrome, matching native behavior).
- [x] Registry entry in `registry/registry.json` (component + any co-located hook file); registry build and `scripts/test-registry-install.mjs` pass.
- [x] Docs: `component-docs.ts` entry with a live list→detail example composing `NavigationBar.BackButton` via `useStackNavigator`, a browser support note, and a guide section ("Stacked navigation") explaining router integration patterns (Next.js parallel/intercepted routes or state-driven stacks) as documentation only.
- [x] Unit tests plus a Playwright fixture at `apps/docs/app/test-fixtures/stack-navigator/page.tsx` covering push/pop state, inert/focus behavior, repeated and rapidly reversed navigation, and reduced motion.
- [x] [DEVICE_QA.md](../DEVICE_QA.md) gains a stacked-navigation section (transition smoothness, state preservation, focus, rotation mid-transition).

### Should Have

- [x] `onDepthChange` or equivalent callback so consumers can sync UI (e.g. hide `TabBar` when depth > 1) without reaching inside.

## Out of Scope

- Edge-swipe back gesture (feature 005).
- URL/history synchronization, route matching, deep linking — guide-level documentation only.
- Shared-element ("hero") transitions between views.
- Nested stacks and modal stack presentation (evaluate after v1 of the primitive).
- Tab-to-tab transitions.

## Technical Notes

- **Affected boundaries:** New registry component + docs/tests; `NavigationBar.BackButton` is composed via its existing `render` prop — no changes to it. Interacts visually with `AppShell`; no code changes there.
- **Dependencies:** None on other epic children; feature 005 depends on this. No new npm dependency — CSS handles the motion.
- **Compatibility and rollout:** Additive item; transform transitions and `inert` cover the supported browser matrix without an engine-specific animation branch.
- **Rollback or recovery:** Remove the item; feature 005 must not land before this is stable.
- Implementation notes for the executor: keep transition orchestration in a co-located `use-stack-transitions.ts` if the component file grows past readable size (charter principle 6). Use a two-frame commit for newly mounted or revealed views so the browser observes the initial transform before transitioning to rest. `inert` is baseline in all supported browsers.

### UI and accessibility evidence when relevant

- **Canonical pattern or primitive:** iOS `UINavigationController` / Android fragment back stack.
- **Affected variants and states:** entering, exiting, covered, under, revealed, rapidly reversed, and reduced motion.
- **Visual and accessibility checks:** focus-order assertions; inert coverage; screen-reader name/role of view containers; e2e screenshots of mid-transition states optional.

## Risks

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| API drifts toward a router | medium | high | Controlled-entries-only API; review against the non-goal before merging; any URL-aware code is rejected at review |
| Snapshot transitions capture whole documents and conflict with fixed chrome | low | medium | Animate the retained live views with transform-only CSS and never invoke document View Transitions |
| Keeping covered views mounted grows memory on deep stacks | medium | low | Document depth expectations (mobile stacks are shallow); optional `unmountCovered` escape hatch deferred to follow-up work |
| Focus restoration target unmounts during the stay | medium | low | Fall back to revealed view container; test the fallback |
| Transition jank on mobile hardware | medium | medium | Transform only; temporary layer promotion only for participating views; no layout-affecting animation; DEVICE_QA criteria for hardware pass |

## Verification

- `pnpm check` and `pnpm test:e2e` pass, including rapid reversal and reduced-motion specs.
- Registry build + clean-install verification.
- Manual browser and installed-mode checks of repeated navigation in the docs example, with iPhone Safari included in device QA evidence.

## Definition of Done

- [x] All must-have acceptance criteria pass.
- [x] Required invariants and guardrails hold (no routing ownership; covered-view state preserved).
- [x] Verification evidence is recorded.
- [x] No unrelated changes are included.
- [x] Relevant documentation is updated (docs page, guide section, COMPONENTS.md, DEVICE_QA.md).

## Tasks

- [x] Implement the core `StackNavigator` with the controlled API, mounted/inert covered views, focus management, and live-view transitions; land with unit tests, the Playwright fixture, e2e coverage of push/pop/inert/focus, and the registry entry verified by clean install.
- [x] Add interruptible push/pop choreography, reduced-motion behavior, repeated-navigation coverage, and rapid-reversal coverage.
- [x] Write the docs page and "Stacked navigation" guide (including `NavigationBar.BackButton` composition and router-integration patterns as docs only), update `docs/COMPONENTS.md` and DEVICE_QA.md, run full checks, and record evidence.

## Progress

| Criterion or task | Status | Evidence | Notes |
| --- | --- | --- | --- |
| Controlled stack core, live-view motion, mounted/inert views, focus, registry payload, and tests | complete | focused component unit suite (21 passed); focused Playwright spec in Chromium + WebKit; `pnpm lint`; `pnpm typecheck`; `pnpm registry:validate`; `pnpm registry:build`; clean `@pwa-ui/stack-navigator` install | The component retains only the prior top during pop, snaps intermediate entries on multi-entry changes, and records recent pointer triggers so WebKit can restore focus even though pointer-clicked buttons do not receive focus there. |
| Interruptible transitions and reduced motion | complete | focused StackNavigator Playwright set in Chromium + WebKit; component unit suite; lint, typecheck, registry validation/build | Participating live views animate with transforms only; reduced motion normalizes to an effectively zero CSS duration. |
| Documentation, composition guide, support matrix, and release verification | complete | `pnpm check` (36 unit tests, 24 registry items, 41 static pages); full Playwright suite (42 passed in Chromium + WebKit); clean local registry install; visual inspection of the docs example | The guide keeps URL ownership with the host router, documents state-driven stacks and Next.js parallel/intercepted routes, and the component now ignores stable-key content refreshes for transition purposes while falling back safely if `startViewTransition` throws. |
| Safari navigation reliability correction | complete | focused live-view and rapid-reversal Playwright coverage | Replaced document snapshots with interruptible, transform-only motion after repeated navigation stalled in iPhone Safari and installed display mode. |
