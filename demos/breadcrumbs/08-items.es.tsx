import { Breadcrumbs } from '@rubenchodev/materix-react/components/breadcrumbs';

export const title = { en: 'From a list of items', es: 'Desde una lista de ítems' };
export const description = {
  en: "`items` describes the trail as data (`label`, `href`, `icon`, `current`, `data`), like vanilla `setItems()`.",
  es: "`items` describe la ruta como datos (`label`, `href`, `icon`, `current`, `data`), como `setItems()` de vanilla.",
};

const TRAIL = [
  { label: 'Ayuda', href: '#' },
  { label: 'Facturación', href: '#' },
  { label: 'Cambiar método de pago' },
];

export default function Demo() {
  return (
    <div className="demo-stack">
      <Breadcrumbs items={TRAIL} aria-label="Ubicación en el centro de ayuda" />
    </div>
  );
}
