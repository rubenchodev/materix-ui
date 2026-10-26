/**
 * Página de ejemplo compartida: barra superior, cabecera y una <section> por demo.
 */
import { useEffect, type ReactNode } from 'react';
import '@rubenchodev/materix-ui/base.css';
import '@rubenchodev/materix-ui/utilities.css';
import './example.css';
import { toggleTheme, useExampleTheme } from './theme';
import type { DemoEntry } from './demos';

export { loadDemos } from './demos';
export type { DemoEntry, DemoModule, LocalizedText } from './demos';

const VANILLA_BASE = 'https://qualitycode.dev/materix-ui/vainilla/examples';
const NO_VANILLA_EXAMPLE = new Set(['form-helper-text']);

export interface ExampleTopBarProps {
  /** Ruta relativa al índice de ejemplos. */
  homeHref: string;
  /** Slug del componente para enlazar su ejemplo vanilla (omitir en el índice). */
  slug?: string;
}

/**
 * Barra superior con enlace al índice, ejemplo vanilla equivalente y alternador de tema.
 * @param {ExampleTopBarProps} props Propiedades.
 * @returns {JSX.Element} Barra.
 */
export function ExampleTopBar({ homeHref, slug }: ExampleTopBarProps) {
  const theme = useExampleTheme();
  const themeLabel = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
  // Componentes sin página de ejemplo propia en vanilla: se enlaza al índice.
  const vanillaHref =
    slug && !NO_VANILLA_EXAMPLE.has(slug) ? `${VANILLA_BASE}/${slug}/index.html` : `${VANILLA_BASE}/index.html`;
  return (
    <header className="demo-topbar">
      <a className="demo-topbar__brand" href={homeHref}>
        <span className="demo-topbar__logo" aria-hidden="true">
          M
        </span>
        <span>Materix UI</span>
        <span className="demo-topbar__tag">React</span>
      </a>
      <nav className="demo-topbar__nav" aria-label="Examples">
        <a className="demo-topbar__link" href={homeHref} aria-label="All components" title="All components">
          <span className="material-icons" aria-hidden="true">
            apps
          </span>
          <span className="demo-topbar__link-text">All components</span>
        </a>
        <a className="demo-topbar__link" href={vanillaHref} target="_blank" rel="noopener noreferrer" aria-label="Vanilla example (opens in a new tab)" title="Vanilla example">
          <span className="material-icons" aria-hidden="true">
            open_in_new
          </span>
          <span className="demo-topbar__link-text">Vanilla example</span>
        </a>
      </nav>
      <button
        type="button"
        className="demo-topbar__icon-btn"
        aria-label={themeLabel}
        title={themeLabel}
        data-demo-theme-toggle=""
        onClick={toggleTheme}
      >
        <span className="material-icons" aria-hidden="true">
          {theme === 'dark' ? 'light_mode' : 'dark_mode'}
        </span>
      </button>
    </header>
  );
}

export interface ExampleShellProps {
  homeHref: string;
  slug?: string;
  children: ReactNode;
}

/**
 * Envoltorio común (`.mtx-root` + barra superior + `<main>`); marca la página como lista para E2E.
 * @param {ExampleShellProps} props Propiedades.
 * @returns {JSX.Element} Shell.
 */
export function ExampleShell({ homeHref, slug, children }: ExampleShellProps) {
  useEffect(() => {
    document.documentElement.setAttribute('data-example-ready', '');
  }, []);
  return (
    <div className="mtx-root">
      <ExampleTopBar homeHref={homeHref} slug={slug} />
      <main className="demo-shell" id="main">
        {children}
      </main>
    </div>
  );
}

/**
 * Convierte los fragmentos entre backticks en `<code>`.
 * @param {string} text Texto con marcas de código.
 * @returns {ReactNode[]} Nodos listos para pintar.
 */
function renderInlineCode(text: string): ReactNode[] {
  return text.split(/(`[^`]+`)/g).map((part, i) =>
    part.startsWith('`') && part.endsWith('`') && part.length > 1 ? <code key={i}>{part.slice(1, -1)}</code> : part,
  );
}

export interface ExamplePageProps {
  /** Carpeta del componente (`button`, `text-field`...). */
  slug: string;
  /** Nombre visible del componente (en inglés). */
  title: string;
  /** Descripción corta opcional (en inglés). */
  description?: string;
  /** Demos ya cargadas con `loadDemos()`. */
  demos: DemoEntry[];
}

/**
 * Página completa de ejemplos de un componente.
 * @param {ExamplePageProps} props Propiedades.
 * @returns {JSX.Element} Página.
 */
export function ExamplePage({ slug, title, description, demos }: ExamplePageProps) {
  useEffect(() => {
    document.title = `${title} · Materix UI React`;
  }, [title]);

  return (
    <ExampleShell homeHref="../index.html" slug={slug}>
      <header className="demo-header">
        <div>
          <span className="demo-crumbs">
            <a href="../index.html">Examples</a> · {slug}
          </span>
          <h1>{title}</h1>
          {description ? <p className="demo-lead">{renderInlineCode(description)}</p> : null}
        </div>
      </header>

      {demos.length > 1 ? (
        <nav className="demo-toc" aria-label="On this page">
          {demos.map((demo) => (
            <a key={demo.id} href={`#${demo.id}`}>
              {demo.title.en}
            </a>
          ))}
        </nav>
      ) : null}

      {demos.map(({ id, title: demoTitle, description: demoDescription, Component }, index) => (
        <section
          key={id}
          id={id}
          className={index === 0 ? 'demo-section demo-section--highlight' : 'demo-section'}
          aria-labelledby={`${id}-title`}
        >
          <h2 id={`${id}-title`}>{demoTitle.en}</h2>
          {demoDescription ? <p>{renderInlineCode(demoDescription.en)}</p> : null}
          <Component />
        </section>
      ))}
    </ExampleShell>
  );
}
