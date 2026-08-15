import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Github } from "lucide-react";

import { ComponentShowcase } from "./showcase";

export const metadata: Metadata = {
  title: "Components — PWA UI",
  description: "Eight source-owned mobile primitives for app-like web applications.",
};

export default function ComponentsPage() {
  return (
    <div className="catalog-shell">
      <header className="catalog-topbar">
        <Link href="/" className="brand focus-ring" aria-label="Back to PWA UI home">
          <span className="brand-mark" aria-hidden="true">P</span>
          <span>PWA UI</span>
          <span className="version">Components</span>
        </Link>
        <Link href="/" className="catalog-back"><ArrowLeft size={16} /> Overview</Link>
        <a className="icon-link focus-ring" href="https://github.com/pwa-ui/pwa-ui" aria-label="View source on GitHub"><Github size={18} /></a>
      </header>
      <main>
        <section className="catalog-hero">
          <p className="section-number">THE MOBILE APPLICATION LAYER</p>
          <h1>Eight primitives.<br /><em>Designed together.</em></h1>
          <p>Touch-first behavior, accessible foundations, safe areas, real viewport handling, and source you can edit after installation.</p>
        </section>
        <ComponentShowcase />
      </main>
    </div>
  );
}
