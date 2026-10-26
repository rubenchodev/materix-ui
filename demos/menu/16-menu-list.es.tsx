import { useState } from 'react';
import { Paper } from '@rubenchodev/materix-react/components/paper';
import { MenuDivider, MenuItem, MenuList } from '@rubenchodev/materix-react/components/menu';

export const title = { en: 'Composition: MenuList', es: 'Composición: MenuList' };
export const description = {
  en: '`MenuList` is the `role="menu"` list that `Menu` uses inside its popper. On its own, inside a `Paper`, it keeps the keyboard navigation (arrows, Home/End, type-ahead, Enter/Space) for always-visible menus.',
  es: '`MenuList` es la lista `role="menu"` que `Menu` usa dentro de su popper. Sola, dentro de un `Paper`, conserva la navegación por teclado (flechas, Home/End, tipeo, Enter/Espacio) para menús siempre visibles.',
};

export default function Demo() {
  const [last, setLast] = useState('—');
  return (
    <div className="demo-row">
      <Paper elevation={1} className="demo-fixed-width">
        <MenuList aria-label="Acciones de edición" className="mtx-py-1" onSelect={({ value }) => value && setLast(value)}>
          <MenuItem icon="content_cut" shortcut="⌘X" value="Cortar">
            Cortar
          </MenuItem>
          <MenuItem icon="content_copy" shortcut="⌘C" value="Copiar">
            Copiar
          </MenuItem>
          <MenuItem icon="content_paste" shortcut="⌘V" value="Pegar">
            Pegar
          </MenuItem>
          <MenuDivider />
          <MenuItem icon="cloud" value="Portapapeles web">
            Portapapeles web
          </MenuItem>
        </MenuList>
      </Paper>
      <span className="demo-status" aria-live="polite">
        Última acción: {last}
      </span>
    </div>
  );
}
