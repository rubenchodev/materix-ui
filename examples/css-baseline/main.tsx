import '@rubenchodev/materix-ui/base.css'; // primero: los CSS de componentes (demos) deben ganar a base.css
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob(['../../demos/css-baseline/*.tsx', '!../../demos/css-baseline/*.*.tsx'], { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage slug="css-baseline" title="CSS Baseline" description="Materix global baseline: Roboto typography, theme background and text colors, box-sizing, visible focus and a light or dark color-scheme." demos={demos} />
  </StrictMode>,
);
