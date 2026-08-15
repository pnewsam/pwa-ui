import {
  ArrowRight,
  Blocks,
  BookOpen,
  Check,
  Code2,
  Github,
  Home,
  Layers3,
  Menu,
  PackagePlus,
  Search,
  Settings2,
  Smartphone,
} from "lucide-react";

import { PwaReady } from "../../../registry/components/pwa-ready/pwa-ready";

const foundations = [
  ["Safe areas", "CSS environment variables, never device lists."],
  ["Real viewports", "Dynamic units and Visual Viewport where needed."],
  ["Owned source", "Readable components copied into your application."],
] as const;

export default function HomePage() {
  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand focus-ring" href="#top" aria-label="PWA UI home">
          <span className="brand-mark" aria-hidden="true">P</span>
          <span>PWA UI</span>
          <span className="version">v0.1</span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#principles">Principles</a>
          <a href="/components">Components</a>
          <a href="#roadmap">Roadmap</a>
        </nav>
        <a className="icon-link focus-ring" href="https://github.com/pwa-ui/pwa-ui" aria-label="View PWA UI on GitHub">
          <Github size={18} />
        </a>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-copy">
            <PwaReady />
            <p className="eyebrow">The missing mobile layer for shadcn</p>
            <h1 id="hero-heading">Mobile web,<br /><em>without the compromise.</em></h1>
            <p className="hero-lede">
              Source-owned React components for safe areas, app chrome, sheets,
              keyboards, and the details that make a PWA feel installed.
            </p>
            <div className="hero-actions">
              <a className="button button-primary focus-ring" href="/components">
                Explore components <ArrowRight size={17} />
              </a>
              <a className="button button-secondary focus-ring" href="#roadmap">
                Read the plan
              </a>
            </div>
            <p className="stack-note"><span>React</span><span>TypeScript</span><span>Tailwind</span><span>Base UI</span></p>
          </div>

          <div className="device-stage" aria-label="Preview of a mobile PWA interface">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="phone">
              <div className="phone-island" />
              <div className="phone-screen">
                <div className="mobile-nav">
                  <button aria-label="Open menu"><Menu size={19} /></button>
                  <strong>Today</strong>
                  <span className="avatar">PN</span>
                </div>
                <div className="mobile-content">
                  <div className="date-row"><span>Saturday, August 15</span><span>72°</span></div>
                  <h2>Good morning.</h2>
                  <p>Three things need your attention.</p>
                  <div className="task-stack">
                    <article className="task task-dark">
                      <div><span className="task-kicker">Focus</span><h3>Shape the mobile web</h3></div>
                      <ArrowRight size={20} />
                    </article>
                    <article className="task">
                      <span className="task-icon"><Check size={17} /></span>
                      <div><h3>Registry connected</h3><p>Source stays yours.</p></div>
                    </article>
                    <article className="task">
                      <span className="task-icon violet"><Layers3 size={17} /></span>
                      <div><h3>8 primitives planned</h3><p>One coherent mobile layer.</p></div>
                    </article>
                  </div>
                </div>
                <nav className="mobile-tabs" aria-label="Demo tabs">
                  <span className="active"><Home size={19} /><small>Home</small></span>
                  <span><Search size={19} /><small>Browse</small></span>
                  <span><Settings2 size={19} /><small>Settings</small></span>
                </nav>
              </div>
            </div>
          </div>
        </section>

        <section className="manifesto" id="principles" aria-labelledby="manifesto-title">
          <div>
            <p className="section-number">01 / WHY</p>
            <h2 id="manifesto-title">A web app should not feel like a website squeezed into a phone.</h2>
          </div>
          <p>
            PWA UI sits between low-level accessible primitives and a full mobile framework.
            It handles the application-shaped problems—without taking over your application.
          </p>
        </section>

        <section className="principles-grid" aria-label="Core technical principles">
          {foundations.map(([title, description], index) => (
            <article key={title}>
              <span>0{index + 1}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </section>

        <section className="registry-section" id="registry" aria-labelledby="registry-title">
          <div className="registry-copy">
            <p className="section-number">02 / DISTRIBUTION</p>
            <h2 id="registry-title">Install it.<br />Then make it yours.</h2>
            <p>
              No opaque runtime. No proprietary theme engine. PWA UI follows the shadcn model:
              install readable source and adapt it to the product you are building.
            </p>
            <div className="feature-list">
              <span><Code2 size={17} /> Readable TypeScript</span>
              <span><PackagePlus size={17} /> Explicit dependencies</span>
              <span><Blocks size={17} /> Natural composition</span>
            </div>
          </div>
          <div className="terminal" aria-label="Installation command example">
            <div className="terminal-bar"><span /><span /><span /><small>terminal</small></div>
            <div className="terminal-body">
              <p><span className="prompt">$</span> pnpm dlx shadcn@latest add \\</p>
              <p className="indent">http://localhost:3000/r/pwa-ready.json</p>
              <p className="terminal-success">✓ Checking registry.</p>
              <p className="terminal-success">✓ Installing dependencies.</p>
              <p className="terminal-success">✓ Created components/pwa-ready.tsx</p>
              <PwaReady className="terminal-badge" label="You own the source" />
            </div>
          </div>
        </section>

        <section className="roadmap" id="roadmap" aria-labelledby="roadmap-title">
          <div className="roadmap-heading">
            <p className="section-number">03 / THE MVP</p>
            <h2 id="roadmap-title">Eight primitives.<br />One focused layer.</h2>
          </div>
          <ol>
            <li><span>01</span><strong>AppShell</strong><small>Dynamic viewport layout</small></li>
            <li><span>02</span><strong>SafeArea</strong><small>Explicit inset control</small></li>
            <li><span>03</span><strong>BottomSheet</strong><small>Touch-first overlays</small></li>
            <li><span>04</span><strong>ResponsiveDialog</strong><small>One API, right context</small></li>
            <li><span>05</span><strong>ActionSheet</strong><small>Native-style actions</small></li>
            <li><span>06</span><strong>NavigationBar</strong><small>Top app chrome</small></li>
            <li><span>07</span><strong>TabBar</strong><small>Bottom navigation</small></li>
            <li><span>08</span><strong>KeyboardAvoidingView</strong><small>Visual viewport aware</small></li>
          </ol>
        </section>
      </main>

      <footer className="footer">
        <div className="brand"><span className="brand-mark" aria-hidden="true">P</span><span>PWA UI</span></div>
        <p>Built for the web platform. Designed for the phone in your hand.</p>
        <a href="#top">Back to top ↑</a>
      </footer>

      <nav className="mobile-site-nav" aria-label="Mobile navigation">
        <a href="#top"><Smartphone size={18} /><span>Overview</span></a>
        <a href="#registry"><PackagePlus size={18} /><span>Registry</span></a>
        <a href="#roadmap"><BookOpen size={18} /><span>Plan</span></a>
      </nav>
    </div>
  );
}
