import { Button } from '@rubenchodev/materix-react/components/button';
import { Drawer, useDrawer } from '@rubenchodev/materix-react/components/drawer';
import type { DrawerAnchor, DrawerWidth } from '@rubenchodev/materix-react/components/drawer';

export const title = { en: 'Widths', es: 'Anchos' };
export const description = {
  en: 'Responsive default: `min(85vw, 320px)` on mobile, 280px from 600px and 300px from 900px. `width="narrow" | "wide" | "full"` sets 200px, 360px or 100vw; any number (px) or CSS length is applied as is. It never exceeds 85% of the window except with `full`.',
  es: 'Por defecto responsive: `min(85vw, 320px)` en móvil, 280px desde 600px y 300px desde 900px. `width="narrow" | "wide" | "full"` fija 200px, 360px o 100vw; cualquier número (px) o longitud CSS se aplica tal cual. Nunca supera el 85% de la ventana salvo con `full`.',
};

interface WidthOption {
  key: string;
  label: string;
  width?: DrawerWidth;
  anchor?: DrawerAnchor;
  title: string;
  text: string;
}

const options: WidthOption[] = [
  { key: 'narrow', label: 'narrow · 200px', width: 'narrow', title: '200px', text: 'Para menús compactos con iconos y etiquetas cortas.' },
  { key: 'default', label: 'por defecto', title: 'Ancho por defecto', text: '320px (máx. 85vw) en móvil, 280px en tablet y 300px en escritorio.' },
  { key: 'wide', label: 'wide · 360px', width: 'wide', title: '360px', text: 'Para formularios, filtros complejos o listados detallados.' },
  { key: 'custom', label: '450px', width: 450, anchor: 'right', title: '450px', text: 'Cualquier longitud: width={450} o width="40vw".' },
  { key: 'full', label: 'full · 100vw', width: 'full', title: 'Pantalla completa', text: 'Ocupa todo el ancho; útil en móvil para flujos completos.' },
];

/** Disparador y drawer de un ancho (cada uno con su `useDrawer`). */
function WidthDemo({ option }: { option: WidthOption }) {
  const drawer = useDrawer();
  return (
    <>
      <Button variant="outlined" {...drawer.getTriggerProps({ action: 'open' })}>
        {option.label}
      </Button>
      <Drawer width={option.width} anchor={option.anchor} title={option.title} padded {...drawer.drawerProps}>
        <p>{option.text}</p>
      </Drawer>
    </>
  );
}

export default function Demo() {
  return (
    <div className="demo-row">
      {options.map((option) => (
        <WidthDemo key={option.key} option={option} />
      ))}
    </div>
  );
}
