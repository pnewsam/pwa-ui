"use client";

/* eslint-disable @next/next/no-html-link-for-pages -- Hosted vinext navigation requires native document requests. */

import * as React from "react";
import { usePathname } from "next/navigation";
import { Braces, Menu, X } from "lucide-react";

import { componentDocs } from "@/lib/component-docs";
import { hookDocs } from "@/lib/hook-docs";

export function DocsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <div className="docs-root">
      <header className="docs-header">
        <a href="/" className="docs-brand" aria-label="PWA UI documentation home">
          <span className="docs-brand-mark" aria-hidden="true">P</span>
          <span>PWA UI</span>
          <span className="docs-version">v0.1</span>
        </a>
        <div className="docs-header-center">
          <span className="docs-section-label">Documentation</span>
        </div>
        <div className="docs-header-actions">
          <a href="/resources/registry" aria-label="View registry documentation"><Braces size={18} /></a>
          <button className="docs-menu-button" type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}>
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </header>

      <div className="docs-frame">
        <aside className={`docs-sidebar ${menuOpen ? "is-open" : ""}`} aria-label="Documentation navigation">
          <nav>
            <div className="docs-nav-group">
              <p>Getting started</p>
              <a className={pathname === "/" ? "is-active" : ""} href="/" onClick={() => setMenuOpen(false)}>Introduction</a>
            </div>
            <div className="docs-nav-group">
              <p>Components</p>
              {componentDocs.map((component) => {
                const href = `/components/${component.slug}`;
                return <a key={component.slug} className={pathname === href ? "is-active" : ""} href={href} onClick={() => setMenuOpen(false)}>{component.name}</a>;
              })}
            </div>
            <div className="docs-nav-group">
              <p>Hooks</p>
              {hookDocs.map((hook) => {
                const href = `/hooks/${hook.slug}`;
                return <a key={hook.slug} className={pathname === href ? "is-active" : ""} href={href} onClick={() => setMenuOpen(false)}>{hook.name}</a>;
              })}
            </div>
            <div className="docs-nav-group">
              <p>Resources</p>
              <a className={pathname === "/resources/device-qa" ? "is-active" : ""} href="/resources/device-qa" onClick={() => setMenuOpen(false)}>Device QA</a>
              <a className={pathname === "/resources/registry" ? "is-active" : ""} href="/resources/registry" onClick={() => setMenuOpen(false)}>Registry source</a>
            </div>
          </nav>
        </aside>
        {menuOpen ? <button className="docs-menu-backdrop" aria-label="Close navigation" onClick={() => setMenuOpen(false)} /> : null}
        <main className="docs-main">{children}</main>
      </div>
    </div>
  );
}
