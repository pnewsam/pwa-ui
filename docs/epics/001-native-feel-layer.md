# Epic: Native-Feel Layer

## Metadata

- **ID:** 001
- **Status:** in_progress
- **Created:** 2026-08-19
- **Target quarter:** 2026-Q4
- **Owner:** maintainer (pnewsam)
- **Last updated:** 2026-08-19

## Charter Alignment

### Charter Reference
- **Principle advanced:** "Build mobile web apps that feel installed" — specifically the value proposition that PWA UI makes web applications *feel* like installed applications, and principle 3, "Phone-first, then desktop."
- **North star metric affected:** "The pwaui.com docs app, used on a real phone, demonstrably feels installed — it is the primary proof of the library." This epic supplies the missing feel layer (navigation transitions, scroll physics, feedback) and the showcase surface that proves it.
- **Non-goal check:** The stack primitive must not own routing, data, or history policy (charter non-goal "Owning routing"). It renders a stack of views and animates transitions; the consumer's router or local state decides what is on the stack. Haptics and pull-to-refresh must degrade to honest no-ops where the platform lacks support (principle 5).

### Alignment Checklist
- [x] This epic directly advances the quoted charter principle.
- [x] Success criteria map to a charter success metric or leading indicator.
- [x] This epic does not violate any charter non-goal.
- [x] If partially misaligned, the exception is justified and documented below.

## Problem Statement

The v0.1 beta covers mobile *chrome* — safe areas, viewport and keyboard handling, sheets, tab and navigation bars, lifecycle prompts — but not the *dynamics* that actually distinguish installed apps from web pages: stacked push/pop navigation with transitions and back-swipe, scroll position that survives tab switches, pull-to-refresh, and tactile feedback. Independent review (2026-08-19) identified this as the gap between "a good settings-screen kit" and "a native-feel kit," and identified pwaui.com itself as an underused proof surface: a visitor on a phone should be able to install the docs app and feel the difference within 30 seconds. All of this work is buildable now in emulators and browsers, before physical-device QA (tracked separately in [DEVICE_QA.md](../DEVICE_QA.md)) completes.

## Goals

1. Ship a router-agnostic stacked-navigation primitive with View Transitions–based push/pop and progressive edge-swipe back, filling the largest "feels installed" gap.
2. Ship the small-physics layer — pull-to-refresh, per-view scroll restoration, and a haptics hook — as independently installable registry items consistent with the existing `--pwa-*` CSS contract.
3. Turn the pwaui.com docs app into an installable showcase that composes every registry item into one phone-first demo flow, making the site itself the primary sales pitch.

## Success Criteria

| Criterion | Target | Measurement Method | Deadline |
| --------- | ------ | ------------------ | -------- |
| Stack navigation ships | `StackNavigator` (or equivalent) installable from the registry with push/pop transitions, reduced-motion and no-View-Transitions fallbacks, and docs page with live example | `pnpm registry:build` payload verified by `scripts/test-registry-install.mjs`; Playwright e2e for push/pop/back state; docs page deployed | 2026-10-31 |
| Physics layer ships | `PullToRefresh`, `useScrollRestoration`, `useHaptics` installable from the registry, each with docs and honest capability caveats | Same registry + e2e verification; unit tests in `apps/docs/test/`; docs pages state per-platform support | 2026-10-15 |
| Showcase demo live | pwaui.com serves an installable showcase flow (stacked detail navigation, tab switching with restored scroll, sheet + keyboard form, pull-to-refresh, install/update prompts) reachable from the home page | Lighthouse installability pass in CI; Playwright e2e covering the full demo flow; manifest + service worker verified | 2026-11-15 |
| Feel is verifiable | Every new surface has rows in DEVICE_QA.md with concrete pass criteria (physical verification itself may remain pending, per the beta status) | DEVICE_QA.md diff review | 2026-11-15 |

## Scope

### In Scope

- A stacked-view navigation primitive: declarative stack of views, push/pop with same-document View Transitions where supported, CSS-fallback transition otherwise, `prefers-reduced-motion` respected, focus management between views.
- An edge-swipe back gesture layered onto the stack primitive as a separable enhancement, using Pointer Events, with explicit conflict handling for platform-native back gestures.
- `PullToRefresh`: touch-driven refresh control composing with `AppShell.Main` and arbitrary scroll containers, with overscroll containment.
- `useScrollRestoration`: per-key scroll position persistence (keyed by tab, stack entry, or consumer-supplied key) that remains router-agnostic.
- `useHaptics`: capability-detected haptic feedback (`navigator.vibrate` where available; documented no-op on iOS Safari).
- Docs-app showcase: installable demo flow on pwaui.com composing the above with the existing v0.1 surface; manifest/service-worker work needed for installability of the docs app itself.
- Registry entries, docs pages, unit + Playwright coverage, and DEVICE_QA.md rows for every shipped item.

### Out of Scope (for this epic)

- Owning routing or URL/history synchronization — the stack primitive exposes hooks for routers but ships without one (charter non-goal).
- Shared-element transitions between arbitrary pages beyond what the stack primitive's View Transitions usage provides.
- Physical-device QA execution — the epic adds checklist rows and pass criteria; running the matrix on hardware remains the separate pre-stable gate.
- List virtualization / scroll performance tooling.
- Service-worker generation or precaching strategy as a library feature (the docs app may configure its own worker; that stays app-local).
- Native wrappers, app-store distribution, push notifications.

## Child Features

Listed in intended execution order (physics first to de-risk the pipeline, stack next, showcase last):

- [x] [001 `pull-to-refresh`](../features/001-pull-to-refresh.md) — touch-driven refresh control for `AppShell.Main` and generic scroll containers.
- [x] [002 `scroll-restoration`](../features/002-scroll-restoration.md) — `useScrollRestoration` hook with per-key persistence and a documented TabBar composition.
- [ ] [003 `use-haptics`](../features/003-use-haptics.md) — capability-detected haptic feedback hook with honest platform caveats.
- [ ] [004 `stack-navigator`](../features/004-stack-navigator.md) — router-agnostic stacked view container with View Transitions push/pop, fallback transitions, and focus management.
- [ ] [005 `stack-back-gesture`](../features/005-stack-back-gesture.md) — Pointer Events edge-swipe back with gesture-tracked progress, layered on `stack-navigator` (depends on 004).
- [ ] [006 `showcase-demo`](../features/006-showcase-demo.md) — installable pwaui.com demo flow composing the full registry surface, plus docs-app manifest/service-worker installability (depends on 001–005).

## Dependencies & Risks

### Dependencies

- Base UI Drawer behavior (already a dependency) for any sheet interactions inside the showcase; no new runtime dependency is expected for the stack primitive (charter principle 1).
- The existing `--pwa-*` CSS variable contract and `PWAProvider`; new items must consume, not fork, that contract.
- Showcase installability depends on the docs app gaining a real service worker; `use-service-worker-update` observes but does not register one.

### Risks

| Risk | Likelihood | Impact | Mitigation |
| ---- | ---------- | ------ | ---------- |
| View Transitions API gaps (older Safari/Firefox) make push/pop inconsistent | high | medium | Feature-detect `document.startViewTransition`; ship a CSS transform fallback; treat the transition as enhancement, correctness of stack state as baseline; document the support matrix |
| Edge-swipe back conflicts with browser/OS edge gestures (Safari back-swipe in browser mode; OS gestures in standalone) | high | high | Keep the gesture a separable opt-in feature; feature-gate by display-mode; define and test conflict behavior; allow consumers to disable per surface |
| Stack primitive drifts toward becoming a router | medium | high | API review against the charter non-goal before implementation; stack accepts views + callbacks, never URLs |
| `navigator.vibrate` is unavailable on iOS Safari, making `useHaptics` mostly Android-only | high | low | Ship as honest no-op with `supported` flag; document clearly (charter principle 5); keep the item small |
| Pull-to-refresh fights native overscroll/rubber-banding and the existing `overscroll-contain` shell styles | medium | medium | Build on the shell's existing overscroll containment; only arm the gesture at scrollTop 0; e2e-test scroll interplay |
| Showcase scope balloons into a second application to maintain | medium | medium | Compose existing docs examples into one flow rather than building a parallel app; reuse registry source verbatim |
| All feel work is validated only in emulators until device QA runs | high | medium | Encode concrete pass criteria in DEVICE_QA.md as part of each feature; keep beta status caveat until the matrix is filled |

## Timeline

| Phase | Duration | Target Completion |
| ----- | -------- | ----------------- |
| Feature planning (`plan-feature` per child) | 1 week | 2026-08-26 |
| Physics layer implementation (`pull-to-refresh`, `scroll-restoration`, `use-haptics`) | 3 weeks | 2026-09-30 |
| Stack navigation implementation (`stack-navigator`, then `stack-back-gesture`) | 4 weeks | 2026-10-31 |
| Showcase demo + validation | 2 weeks | 2026-11-15 |

## Notes

- Origin: independent critical review of the project (2026-08-19), which ranked these as the highest-leverage items buildable without physical devices. Device QA evidence and production adoption were ranked higher for trust but are tracked outside this epic.
- Sequencing rationale: the physics items are small, independent, and de-risk the registry/docs pipeline for the larger stack work; the showcase lands last so it can compose everything, but its manifest/service-worker groundwork can start any time.
- Open question for the maintainer: whether `stack-navigator` should ship a thin optional adapter example for Next.js App Router in docs (guide-only) — recommended as documentation, not as registry code, to respect the routing non-goal.
- Open question: minimum browser support line for View Transitions fallback testing (suggest: latest two Safari majors, latest Chrome/Android WebView, latest Firefox).
