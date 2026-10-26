import { AppBar } from '@rubenchodev/materix-react/components/app-bar';

export const title = { en: 'Colors', es: 'Colores' };
export const description = {
  en: '`color`: `primary`, `secondary`, `default` (paper, the default value), `transparent` and `inherit`. `elevation` changes the shadow (4 by default); `elevation={0}` adds `--flat` and, in `default`, a single bottom divider.',
  es: '`color`: `primary`, `secondary`, `default` (paper, el valor por defecto), `transparent` e `inherit`. `elevation` cambia la sombra (4 por defecto); `elevation={0}` añade `--flat` y, en `default`, un único divisor inferior.',
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <AppBar position="static" color="primary" title="Primary" startIcon="menu" />
      <AppBar position="static" color="secondary" title="Secondary" startIcon="menu" />
      <AppBar position="static" color="default" title="Default" startIcon="menu" />
      <AppBar position="static" color="default" elevation={0} title="Default, elevación 0 (plana)" startIcon="menu" />
      <AppBar position="static" color="primary" elevation={12} title="Primary, elevación 12" startIcon="menu" />
      <AppBar position="static" color="transparent" elevation={0} title="Transparent" startIcon="menu" />
      <div className="mtx-color-primary">
        <AppBar position="static" color="inherit" title="Inherit (toma el color del padre)" startIcon="menu" />
      </div>
    </div>
  );
}
