import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Menu, MenuItem, useMenu } from '@rubenchodev/materix-react/components/menu';

export const title = { en: 'States', es: 'Estados' };
export const description = {
  en: 'Normal, selected (`selected`, receives focus when opened with the keyboard) and disabled (`disabled`, skipped by the keyboard). Hover for the hover state; open with Enter and move with the arrow keys for focus.',
  es: 'Normal, seleccionado (`selected`, recibe el foco al abrir con teclado) y deshabilitado (`disabled`, el teclado lo salta). Pasa el ratón para el hover; abre con Enter y muévete con las flechas para el foco.',
};

const VIEWS = [
  { value: 'list', label: 'Lista', icon: 'view_list', disabled: false },
  { value: 'grid', label: 'Cuadrícula', icon: 'grid_view', disabled: false },
  { value: 'timeline', label: 'Cronología (próximamente)', icon: 'view_timeline', disabled: true },
];

export default function Demo() {
  const menu = useMenu();
  const [view, setView] = useState('list');
  const current = VIEWS.find((v) => v.value === view) ?? VIEWS[0];
  return (
    <div className="demo-row">
      <Button variant="outlined" {...menu.triggerProps}>
        Vista: {current.label}
      </Button>
      <Menu {...menu.menuProps} onSelect={({ value }) => value && setView(value)}>
        {VIEWS.map((v) => (
          <MenuItem key={v.value} value={v.value} icon={v.icon} selected={v.value === view} disabled={v.disabled}>
            {v.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
