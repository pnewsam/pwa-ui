# Changelog

Notable changes to PWA UI will be documented here. The project follows semantic versioning after the first stable release.

## Unreleased — v0.1 beta candidate

### Added

- Source-owned registry components for mobile layout, navigation, overlays, and PWA lifecycle feedback.
- Shared hooks for display mode, visual viewport, installation, updates, connectivity, and page visibility.
- `PWAProvider` for one shared viewport subscription and document-level layout variables.
- Documentation with live examples, usage snippets, and copy-pasteable implementation source.
- Browser support, accessibility, device QA, release status, sitemap, and canonical metadata.

### Changed

- Preserved Base UI functional `className` composition in wrapped drawer and dialog parts.
- Added reduced-motion behavior to animated navigation and overlay surfaces.
- Removed the proof-only `pwa-ready` registry item.

### Fixed

- Keyboard layout calculations now ignore pinch zoom, use a stable pre-keyboard baseline, and reset after orientation changes.
- AppShell footers can remain, hide, or lift while a likely software keyboard is open.
