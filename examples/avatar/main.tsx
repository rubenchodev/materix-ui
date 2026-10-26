import '@rubenchodev/materix-ui/base.css'; // primero: los CSS de componentes (demos) deben ganar a base.css
/**
 * Página de ejemplo de Avatar: monta todas las demos de demos/avatar.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob(['../../demos/avatar/*.tsx', '!../../demos/avatar/*.*.tsx'], { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage
      slug="avatar"
      title="Avatar"
      description="Represents a person or entity with an image, initials or an icon; AvatarGroup stacks several and summarizes the overflow."
      demos={demos}
    />
  </StrictMode>,
);
