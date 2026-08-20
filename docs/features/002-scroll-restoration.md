# Feature: useScrollRestoration

## Contents

- Metadata
- Outcome and context
- Evidence or product alignment
- Acceptance criteria
- Technical notes and risks
- Verification and tasks
- Progress

## Metadata

- **ID:** 002
- **Mode:** product
- **Status:** complete
- **Created:** 2026-08-19
- **Last updated:** 2026-08-19
- **Owner:** maintainer (pnewsam)
- **Parent Epic:** [001-native-feel-layer](../epics/001-native-feel-layer.md)
- **Product Basis:** [CHARTER.md](../CHARTER.md) value proposition ("feel installed"); epic goal 2 (physics layer). Respects the "no routing ownership" non-goal.

## Outcome

A `use-scroll-restoration` registry hook that persists and restores the scroll position of any scroll container per consumer-supplied key (tab, stack entry, route), plus a documented TabBar composition pattern — installable, tested, and documented.

## Context

Switching tabs in a native app never loses your place; in most web apps every tab switch remounts the view and lands at the top. The library's `TabBar` deliberately owns no routing, so view swapping happens in consumer code — which is exactly where scroll position gets lost. Browser-native `history.scrollRestoration` only covers document-level history navigation, not swapped panes inside `AppShell.Main`. No current registry item addresses this.

## Product Alignment

- **User story:** As a developer with tabbed or stacked views inside `AppShell.Main`, I want each view to reopen at its previous scroll position so that navigation feels stateful like an installed app.
- **Epic goal advanced:** Goal 2 — ship the small-physics layer.
- **Charter principle advanced:** Consumers own the source; no runtime package; router-agnostic (non-goal: owning routing).
- **Relevant non-goal:** The hook never touches `history`, never intercepts navigation, and has no router adapter in registry code. Router integration is documentation only.

## Acceptance Criteria

### Must Have

- [x] `useScrollRestoration` hook exists at `registry/hooks/use-scroll-restoration.ts` with signature approximately `useScrollRestoration(key: string, options?: { storage?: "memory" | "session"; behavior?: "auto" | "instant" }) => { ref: (node: HTMLElement | null) => void; save: () => void; clear: (key?: string) => void }`.
- [x] Attaching the returned `ref` to a scroll container restores the stored position for `key` after the element mounts, and continuously records position (throttled, passive scroll listener) while mounted.
- [x] Restoration copes with late-arriving content: if the stored offset exceeds the current `scrollHeight`, the hook retries restoration on a bounded schedule (e.g. rAF + `ResizeObserver` on the container, capped ~2s) rather than silently clamping on first paint, and stops once restored or the user scrolls.
- [x] Key changes on a live element save the old key's position and restore the new key's position — this is the tab-switch path when the consumer keeps one scroller and swaps content.
- [x] `storage: "memory"` (default) is a module-level Map shared across hook instances; `storage: "session"` persists through `sessionStorage` under a namespaced key (`pwa-ui:scroll:<key>`) and degrades silently to memory when storage throws (private mode).
- [x] SSR-safe: no window access at module scope; server render is a no-op, consistent with existing hooks in `registry/hooks/`.
- [x] Restoration is instant by default (no smooth-scroll animation) and never fights user input: any user scroll during the retry window cancels pending restoration.
- [x] Registry entry in `registry/registry.json`; `pnpm registry:build` output installs cleanly via `scripts/test-registry-install.mjs`.
- [x] Docs entry in `apps/docs/lib/hook-docs.ts` including a worked TabBar example: three tabs swapping content inside `AppShell.Main`, each restoring its own position; note the alternative "keep views mounted and toggle visibility" pattern and when to prefer it.
- [x] Unit tests in `apps/docs/test/hooks.test.tsx` (save/restore, key change, storage fallback, late-content retry) and a Playwright fixture at `apps/docs/app/test-fixtures/scroll-restoration/page.tsx` with an e2e assertion that a tab switch away and back restores the offset within a tolerance of ±1px.

### Should Have

- [x] `clear()` with no argument clears all stored positions (useful on logout/reset).

## Out of Scope

- Document/window-level scroll restoration across history navigation (browser behavior; note `history.scrollRestoration` in docs instead).
- Router adapters or history listeners of any kind.
- Scroll position sync across stack-navigator entries — feature 004 composes this hook; nothing here depends on 004.
- Virtualized-list restoration (virtualizers own their scroll state; document the boundary).

## Technical Notes

- **Affected boundaries:** New registry hook + docs/tests. No changes to `TabBar` or `AppShell` code — composition is documented, not baked in.
- **Dependencies:** None. No new npm dependency.
- **Compatibility and rollout:** Additive. `ResizeObserver` is baseline in all supported browsers.
- **Rollback or recovery:** Remove the item; no other registry code may import it (keep it leaf-level).
- Implementation notes: use a callback ref (not `useRef`) so the hook observes mount/unmount; save on `pagehide`/`visibilitychange` as well as unmount so backgrounding an installed PWA does not lose positions; keep the throttle rAF-based to match `use-visual-viewport` conventions.

## Risks

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| Late-loading content makes restoration land at the wrong offset | high | medium | Bounded retry with ResizeObserver; cancel on user scroll; document a `save()` escape hatch and the mounted-views alternative |
| Restoration races the consumer's own focus/scroll effects | medium | low | Restore in a microtask after mount, instant behavior, document ordering; user scroll always wins |
| sessionStorage quota/privacy modes throw | medium | low | Try/catch with silent fallback to memory; unit-test the fallback |

## Verification

- `pnpm check` and `pnpm test:e2e` pass with the new coverage.
- Registry build + clean-install verification for `use-scroll-restoration`.
- The docs TabBar example demonstrably restores position in the e2e run (offset asserted).

## Definition of Done

- [x] All must-have acceptance criteria pass.
- [x] Required invariants and guardrails hold (no history/router coupling; user scroll wins).
- [x] Verification evidence is recorded.
- [x] No unrelated changes are included.
- [x] Relevant documentation is updated (hook docs page, COMPONENTS.md lifecycle-hooks section).

## Tasks

- [x] Implement `use-scroll-restoration` with unit tests, registry entry, and clean-install verification passing in one commit.
- [x] Add the docs entry with the TabBar composition example, the Playwright fixture + e2e assertion, and the COMPONENTS.md note; run full checks and record evidence.

## Progress

| Criterion or task | Status | Evidence | Notes |
| --- | --- | --- | --- |
| Hook, persistence strategies, retry behavior, registry payload, and unit tests | complete | `pnpm lint`; `pnpm typecheck`; `pnpm registry:validate`; `pnpm registry:build`; `pnpm --filter @pwa-ui/docs exec vitest run test/hooks.test.tsx`; clean `@pwa-ui/use-scroll-restoration` install | Callback-ref identity changes save the prior key before restoring the next key on the same element; storage failures retain the module-memory copy. |
| Tab composition docs and browser validation | complete | `pnpm check`; `pnpm test:e2e` (30 passed, Chromium + WebKit) | New keys start at zero, prior Feed/Saved offsets restore within ±1px, and the full accessibility scan now waits for its dialog target before running. |
