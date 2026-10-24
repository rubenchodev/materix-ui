import { Fab } from '@rubenchodev/materix-react/components/fab';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: '`icon` generates a circular FAB; add `label` and it becomes extended. The circular FAB needs an `aria-label` because it only shows an icon.',
  es: '`icon` genera un FAB circular; añade `label` y pasa a ser extendido. El FAB circular necesita `aria-label` porque solo muestra un icono.',
};

export default function Demo() {
  return (
    <div className="demo-row">
      <Fab icon="add" aria-label="Create" />
      <Fab icon="edit" color="secondary" aria-label="Edit" />
      <Fab icon="navigation" label="Navigate" />
    </div>
  );
}
