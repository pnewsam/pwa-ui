# Validation Report: Installable showcase demo

**Feature plan:** `docs/features/006-showcase-demo.md`
**Validated:** 2026-08-19
**Branch:** `docs/native-feel-epic`
**Base:** `origin/main`
**Surface:** mixed browser/UI, reusable hook, and PWA configuration

## Summary

| Check | Result |
|-------|--------|
| Targeted showcase checks | PASS — 6/6 Playwright cases in Chromium and WebKit |
| Regression suite | PASS — 56 passed, 2 production-only cases skipped in the development-server run |
| Production PWA audit | PASS — 1/1 Chromium installability and worker-contract test |
| Unit tests | PASS — 39/39 |
| Registry validation and build | PASS — 24 items; 42 static pages |
| Clean-consumer smoke test | PASS — namespace installed into a clean shadcn fixture |
| Lint and typecheck | PASS |
| Acceptance criteria verified | 11/11 implementation criteria |

## Acceptance criteria

| # | Criterion | Result | Notes |
|---|-----------|--------|-------|
| 1 | Production-only app-local service worker supports `SKIP_WAITING` | VERIFIED | Static inspection plus the production PWA test verifies registration, scope, version response, and message behavior. |
| 2 | Complete installable manifest and in-scope worker | VERIFIED | `pnpm test:pwa` starts the production build, validates manifest fields/icons/start URL, and confirms `/demo` is controlled. The live-domain rerun remains a deployment check. |
| 3 | `/demo` composes the required native-feel surfaces | VERIFIED | The route imports and exercises AppShell, NavigationBar, TabBar, StackNavigator, PullToRefresh, scroll restoration, keyboard-aware BottomSheet, install/update UI, and offline feedback. |
| 4 | Showcase consumes canonical registry source | VERIFIED | Demo imports directly from `registry/`; no demo-local component fork exists. |
| 5 | Home-page discovery and return to docs | VERIFIED | Browser test enters through “Try the demo,” returns through Docs, and confirms ordinary docs scrolling is restored. |
| 6 | Responsive desktop presentation | VERIFIED | Browser test asserts the phone frame remains no larger than 433 × 833 CSS pixels at a desktop viewport. |
| 7 | Mobile core-flow automation | VERIFIED | Playwright drives refresh, push/pop with focus, tab scroll return, sheet input focus, close, and offline/online transitions in Chromium and WebKit. |
| 8 | Worker does not affect development or stale registry payloads | VERIFIED | Registration is production-gated; worker is pass-through with no cache and explicit `/r/*` exclusion; production audit verifies no Cache Storage entries. |
| 9 | Showcase device-QA procedure | VERIFIED | `docs/DEVICE_QA.md` now specifies iOS manual install, Android native install, standalone flow, worker update, captions, accessibility, and cache inspection. |
| 10 | Interaction captions link to source documentation | VERIFIED | Captions are present for refresh, stack navigation, scroll restoration, and the sheet composition. |
| 11 | Release update-flow procedure | VERIFIED | `docs/RELEASING.md` documents version bumps, waiting-worker behavior, Update now/Later checks, and emergency rollback. |

## Test results

| Command or test | Result | Notes |
|-----------------|--------|-------|
| `pnpm check` | PASS | Lint, typecheck, 39 unit tests, registry validation/build, and 42-page production build. |
| `pnpm exec playwright test tests/e2e/demo.spec.ts --workers=1` | PASS | 6/6 across Chromium and WebKit, including reduced motion. |
| `pnpm exec playwright test --workers=1` | PASS | 56 passed; the two production-PWA cases are intentionally skipped outside `PWA_UI_E2E_PRODUCTION=1`. |
| `pnpm test:pwa` | PASS | Production manifest, start URL, worker scope/control, no-cache behavior, and security headers. |
| `pnpm test:install` | PASS | Existing clean-consumer namespace smoke test. |
| axe scan including `/demo` | PASS | No automatically detectable accessibility violations. |

## Surface checks

| Check | Result | Notes |
|-------|--------|-------|
| Responsive layout | pass | Full-screen phone viewport and bounded desktop phone frame are automated. |
| Accessibility and focus | pass | axe, detail-view focus, sheet-input focus, and reduced-motion navigation are automated. |
| Docs containment regression | pass | Client navigation back to docs removes root containment and restores window scrolling. |
| Offline state | pass | Browser context offline/online changes show and clear the banner without blocking the flow. |
| Registry-source drift | pass | Registry generation updated the published `use-scroll-restoration` payload after the canonical fix. |

## Issues found and resolved

- The composed flow exposed a live-element session-storage edge case in `useScrollRestoration`: changing tab content could clamp the element to zero before the old key was saved. The hook now tracks the last observed position and handles key changes in layout, with unit and cross-browser regression coverage.
- The production PWA runner could reuse an unrelated development server locally. Production audits now always start their own built server.

## Coverage gaps

- Physical installation and standalone execution on iOS and Android remain pending in `docs/DEVICE_QA.md`, intentionally outside this epic’s implementation scope.
- A real waiting-worker update prompt requires two production deployments and remains a documented release check.
- No cache is used by design, so the showcase demonstrates installability and lifecycle UI but does not promise offline data or document delivery.

## Recommendation

- [x] READY TO SHIP — implementation and automated gates pass; run the recorded physical-device and live-update checks before promoting a stable release.
- [ ] SHIP WITH CAVEATS
- [ ] DO NOT SHIP
