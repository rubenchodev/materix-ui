/**
 * Índice de ejemplos: lista automáticamente cada examples/{slug}/index.html (excepto `shared` y carpetas `_*`).
 * El nombre visible sale del <title> de cada página ("Button · Materix UI React" → "Button").
 */
import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ExampleShell } from './shared/ExamplePage';

interface ExampleLink {
  slug: string;
  name: string;
}

const pages = import.meta.glob<string>('./*/index.html', { query: '?raw', import: 'default', eager: true });

/**
 * Construye la lista de ejemplos a partir del glob de páginas.
 * @param {Record<string, string>} source HTML crudo por ruta.
 * @returns {ExampleLink[]} Ejemplos ordenados por nombre.
 */
const toLinks = (source: Record<string, string>): ExampleLink[] =>
  Object.entries(source)
    .map(([path, html]) => {
      const slug = path.split('/')[1];
      const title = /<title>([^<]*)<\/title>/i.exec(html)?.[1] ?? slug;
      return { slug, name: title.split(' · ')[0].trim() || slug };
    })
    .filter(({ slug }) => slug !== 'shared' && !slug.startsWith('_'))
    .sort((a, b) => a.name.localeCompare(b.name));

const EXAMPLES = toLinks(pages);

/**
 * Página índice del catálogo de ejemplos.
 * @returns {JSX.Element} Índice.
 */
function ExamplesIndex() {
  useEffect(() => {
    document.title = 'Examples · Materix UI React';
  }, []);
  return (
    <ExampleShell homeHref="./index.html">
      <header className="demo-hero">
        <span className="demo-crumbs">Materix UI · React examples</span>
        <h1>Component catalog</h1>
        <p className="demo-lead">
          React components with the Material UI look of Materix UI. Each card opens a working page that uses the real
          library source.
        </p>
      </header>
      <section className="demo-section" aria-labelledby="components-title">
        <h2 id="components-title">
          Components<span className="demo-section__count">{EXAMPLES.length}</span>
        </h2>
        {EXAMPLES.length ? (
          <div className="demo-catalog">
            {EXAMPLES.map(({ slug, name }) => (
              <a key={slug} className="demo-card" href={`${slug}/index.html`}>
                <span className="demo-card__icon" aria-hidden="true">
                  <span className="material-icons">widgets</span>
                </span>
                <span className="demo-card__body">
                  <span className="demo-card__title">{name}</span>
                  <span className="demo-card__text">{slug}</span>
                </span>
              </a>
            ))}
          </div>
        ) : (
          <p>No examples yet.</p>
        )}
      </section>
    </ExampleShell>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplesIndex />
  </StrictMode>,
);
