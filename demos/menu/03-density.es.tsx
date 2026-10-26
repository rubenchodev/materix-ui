import { Button } from '@rubenchodev/materix-react/components/button';
import { Menu, MenuItem, useMenu } from '@rubenchodev/materix-react/components/menu';

export const title = { en: 'Density', es: 'Densidad' };
export const description = {
  en: 'Items have a minimum height of 48px; with `dense` (on the `Menu` or on each item), 32px. `disableGutters` removes the side padding.',
  es: 'Los ítems miden 48px de alto mínimo; con `dense` (en el `Menu` o en cada ítem), 32px. `disableGutters` quita el padding lateral.',
};

/** Menú de interlineado con la densidad indicada. */
function Spacing({ label, dense = false }: { label: string; dense?: boolean }) {
  const menu = useMenu();
  return (
    <div className="demo-group">
      <span className="demo-label">{label}</span>
      <div className="demo-row">
        <Button variant="outlined" {...menu.triggerProps}>
          {dense ? 'Denso' : 'Normal'}
        </Button>
        <Menu {...menu.menuProps} dense={dense}>
          <MenuItem>Sencillo</MenuItem>
          <MenuItem>1,5</MenuItem>
          <MenuItem>Doble</MenuItem>
        </Menu>
      </div>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="demo-row">
      <Spacing label="Normal · 48px" />
      <Spacing label="Denso · 32px" dense />
    </div>
  );
}
