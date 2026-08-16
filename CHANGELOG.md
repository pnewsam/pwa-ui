# Changelog

Notable changes to PWA UI will be documented here. The project follows semantic versioning after the first stable release.

## 0.1.0-beta.1 — 2026-08-15

### Added

- Source-owned registry components for mobile layout, navigation, overlays, and PWA lifecycle feedback.
- Shared hooks for display mode, visual viewport, installation, updates, connectivity, and page visibility.
- `PWAProvider` for one shared viewport subscription and document-level layout variables.
- Documentation with live examples, usage snippets, and copy-pasteable implementation source.
- Browser support, accessibility, device QA, release status, sitemap, and canonical metadata.
- Public GitHub source registry, contribution guidance, support paths, and release automation.

### Changed

- Preserved Base UI functional `className` composition in wrapped drawer and dialog parts.
- Added reduced-motion behavior to animated navigation and overlay surfaces.
- Removed the proof-only `pwa-ready` registry item.

### Fixed

- Keyboard layout calculations now ignore pinch zoom, use a stable pre-keyboard baseline, and reset after orientation changes.
- AppShell footers can remain, hide, or lift while a likely software keyboard is open.

### Known limitations

- Physical iOS and Android verification is still in progress.
- Beta APIs may change when field testing reveals a safer or clearer contract.
