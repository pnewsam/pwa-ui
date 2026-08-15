import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Device QA — PWA UI",
  description: "A practical device and browser checklist for validating PWA UI components.",
};

const sections = [
  {
    title: "Required surfaces",
    items: [
      "Recent Face ID iPhone in Safari.",
      "The same iPhone with the docs app installed to the Home Screen.",
      "Android Chrome on a current device or emulator.",
      "The same Android surface with the PWA installed.",
      "Desktop Chrome, Safari, and Firefox at a narrow viewport.",
    ],
  },
  {
    title: "App frame and safe areas",
    items: [
      "Top navigation clears the status and notch region in portrait and landscape.",
      "The bottom tab bar clears the home indicator and remains reachable.",
      "Content scrolls between fixed application chrome without moving the document unexpectedly.",
      "Browser and standalone heights both recover after rotation.",
      "No component assumes a named device or hard-coded phone dimension.",
    ],
  },
  {
    title: "Overlays",
    items: [
      "BottomSheet opens from touch and keyboard activation.",
      "Backdrop and Escape dismiss once, then focus returns to the trigger.",
      "Slow and fast downward swipes feel controlled without scrolling the page behind the sheet.",
      "Long sheet content scrolls without starting a dismissal gesture unexpectedly.",
      "ResponsiveDialog uses a sheet on narrow screens and a centered dialog on wide screens.",
      "Resizing an open ResponsiveDialog leaves one focus trap and preserves its open state.",
      "ActionSheet groups are clear, destructive actions are distinct, and Cancel is easy to reach.",
    ],
  },
  {
    title: "Software keyboard",
    items: [
      "Focus every field in the mobile form and BottomSheet form.",
      "The focused input remains visible when the keyboard opens.",
      "Pinned actions clear both the keyboard and bottom safe area.",
      "Closing the keyboard restores the layout without a jump or permanent blank space.",
      "Repeat the checks after rotating with a field focused.",
    ],
  },
  {
    title: "Accessibility and motion",
    items: [
      "Tab and Shift+Tab remain inside open overlays.",
      "Titles and descriptions are announced for every overlay.",
      "Important controls have a visible focus ring and at least a 44px touch target.",
      "VoiceOver and TalkBack identify the active tab and every icon-only control.",
      "Reduce Motion removes nonessential transitions without hiding state changes.",
    ],
  },
] as const;

export default function DeviceQaPage() {
  return (
    <article className="docs-article">
      <div className="docs-breadcrumbs">Docs <span>/</span> Resources <span>/</span> Device QA</div>
      <header className="docs-page-header component-header">
        <p className="docs-kicker">Resource</p>
        <h1>Device QA</h1>
        <p>Run this checklist against a production build and record the device, OS and browser version, display mode, date, tester, and any linked issue.</p>
      </header>

      <div className="docs-checklist">
        {sections.map((section) => (
          <section className="docs-section" key={section.title}>
            <h2>{section.title}</h2>
            <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
        ))}
      </div>

      <nav className="docs-pagination" aria-label="Documentation pagination">
        <span />
        <a href="/resources/registry"><small>Next resource</small><strong>Registry source →</strong></a>
      </nav>
    </article>
  );
}
