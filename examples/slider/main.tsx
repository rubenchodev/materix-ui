import '@rubenchodev/materix-ui/base.css'; // primero: los CSS de componentes (demos) deben ganar a base.css
/** Página de ejemplo de Slider: monta todas las demos de demos/slider. */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob(['../../demos/slider/*.tsx', '!../../demos/slider/*.*.tsx'], { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage slug="slider" title="Slider"
      description="Lets users pick a value or a range from a scale by dragging or with the keyboard. Each thumb is a visually hidden native input type=&quot;range&quot;, so screen readers and forms work out of the box; supports marks, value labels, vertical and RTL."
      demos={demos} />
  </StrictMode>,
);
