import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Menu, MenuDivider, MenuGroup, MenuItem, useMenu } from '@rubenchodev/materix-react/components/menu';

export const title = { en: 'Checkable options', es: 'Opciones marcables' };
export const description = {
  en: '`role="menuitemcheckbox"` toggles `aria-checked` on click; `role="menuitemradio"` inside a `MenuGroup` with `value` checks one option and unchecks the rest. The check mark only shows on checked options.',
  es: '`role="menuitemcheckbox"` alterna `aria-checked` al hacer clic; `role="menuitemradio"` dentro de un `MenuGroup` con `value` marca una opción y desmarca las demás. La marca solo se ve en las opciones marcadas.',
};

export default function Demo() {
  const menu = useMenu();
  const [ruler, setRuler] = useState(true);
  const [grid, setGrid] = useState(false);
  const [density, setDensity] = useState('Comfortable');
  return (
    <div className="demo-row">
      <Button variant="outlined" {...menu.triggerProps}>
        View
      </Button>
      <Menu {...menu.menuProps}>
        <MenuItem role="menuitemcheckbox" checked={ruler} onCheckedChange={setRuler}>
          Ruler
        </MenuItem>
        <MenuItem role="menuitemcheckbox" checked={grid} onCheckedChange={setGrid}>
          Grid
        </MenuItem>
        <MenuDivider />
        <MenuGroup label="Density" value={density} onChange={setDensity}>
          <MenuItem role="menuitemradio" value="Comfortable">
            Comfortable
          </MenuItem>
          <MenuItem role="menuitemradio" value="Compact">
            Compact
          </MenuItem>
        </MenuGroup>
      </Menu>
      <span className="demo-status" aria-live="polite">
        Ruler: {ruler ? 'yes' : 'no'} · Grid: {grid ? 'yes' : 'no'} · Density: {density}
      </span>
    </div>
  );
}
