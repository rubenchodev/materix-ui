import '@rubenchodev/materix-ui/base.css'; // primero: los CSS de componentes (demos) deben ganar a base.css
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob('../../demos/grid/*.tsx', { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage slug="grid" title="Grid" description="A 12-column flexbox grid with five breakpoints (xs–xl), gap-based spacing in multiples of 8px (also per breakpoint) and alignment, for responsive layouts." demos={demos} />
  </StrictMode>,
);
