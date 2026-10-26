import { Button } from '@rubenchodev/materix-react/components/button';
import { Menu, MenuDivider, MenuItem, useMenu } from '@rubenchodev/materix-react/components/menu';

export const title = { en: 'Full composition', es: 'Composición completa' };
export const description = {
  en: 'The React equivalent of vanilla’s manual BEM usage: items rendered as native `<button>` (`component="button"`), icons passed as nodes (an inline SVG), a checked option with its check mark, a divider and a disabled item. The DOM is the same BEM structure (`.mtx-menu-item__icon`, `__check`, `--disabled`).',
  es: 'Equivalente React del uso manual BEM de vanilla: ítems como `<button>` nativo (`component="button"`), iconos pasados como nodos (un SVG en línea), una opción marcada con su check, un separador y un ítem deshabilitado. El DOM es la misma estructura BEM (`.mtx-menu-item__icon`, `__check`, `--disabled`).',
};

/** Icono SVG de 24px (lápiz). */
function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
    </svg>
  );
}

export default function Demo() {
  const menu = useMenu();
  return (
    <div className="demo-row">
      <Button variant="text" {...menu.triggerProps}>
        Acciones
      </Button>
      <Menu {...menu.menuProps}>
        <MenuItem component="button" type="button" icon={<EditIcon />} value="edit">
          Editar
        </MenuItem>
        <MenuItem component="button" type="button" icon="visibility" role="menuitemcheckbox" defaultChecked value="view">
          Ver
        </MenuItem>
        <MenuDivider />
        <MenuItem component="button" type="button" disabled>
          Archivar
        </MenuItem>
      </Menu>
    </div>
  );
}
