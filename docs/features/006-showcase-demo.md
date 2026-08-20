# Feature: Installable showcase demo

## Contents

- Metadata
- Outcome and context
- Evidence or product alignment
- Acceptance criteria
- Technical notes and risks
- Verification and tasks
- Progress

## Metadata

- **ID:** 006
- **Mode:** product
- **Status:** complete
- **Created:** 2026-08-19
- **Last updated:** 2026-08-19
- **Owner:** maintainer (pnewsam)
- **Parent Epic:** [001-native-feel-layer](../epics/001-native-feel-layer.md)
- **Product Basis:** [CHARTER.md](../CHARTER.md) success signal 1 ("the pwaui.com docs app… is the primary proof of the library"); epic goal 3.

## Outcome

pwaui.com serves an installable, phone-first showcase flow at `/demo` that composes the registry surface (app shell, tabs with restored scroll, stacked list→detail navigation, pull-to-refresh, sheet + keyboard form, install/update/offline feedback) into one coherent mini-app, reachable prominently from the home page, with the docs app itself passing PWA installability checks.

## Context

The docs site currently documents components individually; a visitor cannot *feel* the library. The project's strongest sales pitch is a visitor installing the docs app on their own phone and experiencing native-feel navigation within 30 seconds (project review, 2026-08-19). The docs app already ships a `manifest.webmanifest` and icons, and the registry includes `UpdatePrompt`/`useServiceWorkerUpdate` — but the hook only observes a registration and the docs app registers no service worker, so today the site is not installable everywhere and the update flow cannot be demonstrated live.

## Product Alignment

- **User story:** As a developer evaluating PWA UI on my phone, I want to open one demo, install it, and feel stacked navigation, tab persistence, pull-to-refresh, and keyboard handling so that I can judge the library in under a minute.
- **Epic goal advanced:** Goal 3 — the site itself is the sales pitch.
- **Charter principle advanced:** Success signal 1; principle 5 (the demo shows honest platform states, e.g. iOS manual install steps).
- **Relevant non-goal:** Service-worker *registration stays app-local to the docs app* — no registry item registers a worker; the library boundary is unchanged.

## Acceptance Criteria

### Must Have

- [x] The docs app registers a minimal, readable app-local service worker (precache of the app shell or a network-first pass-through — smallest thing that yields installability plus a demonstrable update flow) that handles the `SKIP_WAITING` message contract expected by `useServiceWorkerUpdate`.
- [x] The deployed site passes installability: valid manifest (name, icons incl. maskable, `display: standalone`, start URL scoped to the app), service worker in scope, verified by a Lighthouse (or equivalent) installability audit wired into CI or the e2e suite.
- [x] A `/demo` route renders a full-screen mini-app using the documented containment pattern (`data-pwa-app-root`/`data-pwa-app-mount` scoped so ordinary docs pages keep normal scrolling), composing at minimum: `AppShell` + `NavigationBar` + `TabBar` (≥3 tabs), `StackNavigator` list→detail with back gesture where enabled, `useScrollRestoration` on the tabs, `PullToRefresh` on the list (refresh visibly changes data), `BottomSheet`/`ResponsiveDialog` with a `KeyboardAvoidingView` or drawer-keyboard form, `InstallPrompt` (native and iOS manual modes as appropriate), `UpdatePrompt`, and `OfflineBanner`.
- [x] Demo components are imported from the canonical `registry/` source like the rest of the docs app — the demo must not fork or restyle registry internals beyond what a consumer could do with documented props.
- [x] The home page presents the demo prominently ("Try the demo" affordance near the top) and the demo includes a path back to the docs.
- [x] The demo is responsive: on desktop widths it remains usable (e.g. framed at mobile width) rather than broken.
- [x] A Playwright e2e spec drives the core flow on a mobile-sized viewport: open demo → pull-to-refresh updates list → push detail → back → tab switch and return restores scroll → open sheet form and focus input → offline simulation shows the banner. All assertions on real behavior, not screenshots alone.
- [x] The service worker does not interfere with docs development or existing e2e (`pnpm dev` unaffected; worker registered only in production builds or guarded appropriately) and does not cache the registry payloads under `public/r` in a way that could serve stale component source.
- [x] DEVICE_QA.md gains a showcase section: install from the demo page on iOS (manual steps) and Android (native prompt), launch installed, verify the flow standalone.

### Should Have

- [x] A visible "what you're feeling" annotation layer or short captions in the demo linking each interaction to its component docs page.
- [x] Update-flow demonstration note in RELEASING.md (deploying a new version should surface `UpdatePrompt` in installed copies).

## Out of Scope

- Any new registry items or changes to registry component code (defects found while composing become their own convergence features).
- Push notifications, offline data sync, or precaching strategy beyond minimal installability.
- Marketing redesign of the docs home page beyond the demo affordance.
- Physical-device execution of the QA rows (tracked in DEVICE_QA.md as with all surfaces).

## Technical Notes

- **Affected boundaries:** `apps/docs` only (routes, layout wiring, service worker, manifest, home page, e2e). Registry source is consumed, never modified.
- **Dependencies:** Features 001–005 shipped (the demo composes them). If sequencing pressure arises, a reduced demo without stack/physics items is explicitly *not* this feature — wait or re-scope deliberately with the maintainer.
- **Compatibility and rollout:** Deploy via the existing `.github/workflows/deploy.yml`; verify the service worker scope works under the production hosting path. First deploy after this lands is itself the update-flow test for subsequent deploys.
- **Rollback or recovery:** Service-worker rollback is the sharp edge — keep the worker minimal and version-stamped so a bad deploy can ship a no-op worker that self-unregisters; document this in the worker file header.
- Implementation notes: Next.js app router — register the worker from a small client component in the root layout gated to production; the demo route can use a route group with its own layout applying the containment attributes so the `(docs)` group is untouched.

### UI and accessibility evidence when relevant

- **Canonical pattern or primitive:** A native-feeling mini-app (list/detail/tabs/form) as seen in platform HIG examples.
- **Affected variants and states:** browser vs standalone display mode, online/offline, install available/unavailable/installed, keyboard open.
- **Visual and accessibility checks:** demo flow keyboard-navigable; landmarks intact; e2e includes reduced-motion pass.

## Risks

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| Service worker caches stale docs or registry JSON after deploys | medium | high | Minimal cache surface; exclude `/r/*` from caching; version-stamped worker + `SKIP_WAITING` contract; post-deploy check in CI |
| Full-screen containment on `/demo` leaks into docs pages | medium | medium | Route-group-scoped layout; e2e asserts docs pages still scroll normally |
| Demo becomes a second app to maintain | medium | medium | Compose registry source + existing example data only; no bespoke component code beyond glue |
| Installability audit flakes in CI across hosting environments | medium | low | Run the audit against a production build locally in CI (`next build` + server) rather than the live URL |

## Verification

- `pnpm check` and `pnpm test:e2e` pass including the demo-flow spec and the docs-scroll regression assertion.
- Installability audit evidence (Lighthouse JSON or equivalent) recorded.
- Post-deploy manual verification: install on one Android emulator/browser profile and confirm the standalone launch; record in Progress and DEVICE_QA.md.

## Definition of Done

- [x] All must-have acceptance criteria pass.
- [x] Required invariants and guardrails hold (the demo consumes canonical registry source without a fork; docs pages are unaffected; `/r/*` is never cached stale).
- [x] Verification evidence is recorded.
- [x] No unrelated changes are included.
- [x] Relevant documentation is updated (DEVICE_QA.md, RELEASING.md note).

## Tasks

- [x] Make the docs app a real PWA: app-local service worker with the `SKIP_WAITING` contract, production-gated registration, manifest completeness, installability audit wired into CI, and the `/r/*` no-stale guarantee tested.
- [x] Build the `/demo` route: containment-scoped layout, the composed mini-app flow with demo data, home-page affordance, and desktop framing; include the docs-scroll regression assertion.
- [x] Add the end-to-end demo-flow spec (refresh, push/pop, scroll restoration, sheet + keyboard, offline banner), DEVICE_QA.md showcase section, and RELEASING.md update note; run full checks and record evidence.

## Progress

| Criterion or task | Status | Evidence | Notes |
| --- | --- | --- | --- |
| Production PWA foundation and installability audit | complete | `pnpm check` (39 unit tests, 24 registry items, 41 static pages); `pnpm test:pwa` (production Chromium audit passed); CI and deploy workflows run the audit | The version-stamped worker is production-only, passes network requests through without a cache, explicitly excludes `/r/*`, responds to `SKIP_WAITING`, and ships with no-store/security/scope headers. The manifest starts at `/demo` and includes 192px and 512px PNG icons with a maskable 512px entry. |
| Composed `/demo`, route-scoped containment, and discovery | complete | `pnpm check` (39 unit tests, 24 registry items, 42 static pages); focused showcase structural suite (2 passed in Chromium and WebKit); production PWA audit passed with `/demo` start URL; iPhone-sized visual inspection | The demo imports registry source directly and composes app chrome, three tabs, stack navigation, pull-to-refresh, tab scroll restoration, haptics, keyboard-aware sheet form, platform-honest install UI, live service-worker updates, and offline feedback. Desktop framing stays at 432px while the Docs link restores ordinary page scrolling after client navigation. |
| Core-flow automation, release guidance, and final regression | complete | `pnpm check`; `pnpm test:pwa` (1 passed); full Playwright suite (58 passed, 2 production-only skipped); clean-consumer install passed; axe scan includes `/demo` | Cross-browser automation covers refresh, navigation/focus, scroll return, sheet keyboard focus, offline feedback, reduced motion, desktop framing, and docs containment. Composition exposed and resolved a keyed session-scroll overwrite in the canonical hook. Focus transfer is also verified with animation frames deliberately throttled beyond transition cleanup. Physical iOS/Android and a two-deploy worker update remain explicit release checks. |

## Validation

Validated: 2026-08-19 | Report: `docs/features/006-showcase-demo-validation.md` | Result: READY TO SHIP
