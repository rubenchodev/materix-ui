import '@rubenchodev/materix-ui/base.css'; // primero: los CSS de componentes (demos) deben ganar a base.css
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob(['../../demos/speed-dial/*.tsx', '!../../demos/speed-dial/*.*.tsx'], { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage
      slug="speed-dial"
      title="Speed Dial"
      description="Floating action button that reveals three to six related, labeled actions in four directions, on click or on hover."
      demos={demos}
    />
  </StrictMode>,
);
