import '@rubenchodev/materix-ui/base.css'; // primero: los CSS de componentes (demos) deben ganar a base.css
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob(['../../demos/container/*.tsx', '!../../demos/container/*.*.tsx'], { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage slug="container" title="Container" description="Centers page content with a per-breakpoint max width and responsive side gutters (16px on mobile, 24px from 600px)." demos={demos} />
  </StrictMode>,
);
