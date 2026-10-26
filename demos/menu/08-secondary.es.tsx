import { Button } from '@rubenchodev/materix-react/components/button';
import { Menu, MenuDivider, MenuItem, useMenu } from '@rubenchodev/materix-react/components/menu';

export const title = { en: 'Secondary text and shortcuts', es: 'Texto secundario y atajos' };
export const description = {
  en: '`shortcut` aligns a keyboard shortcut or metadata at the end (like the MUI "Edit" menu); `secondary` adds a second line under the text. `image` shows a 24px picture instead of an icon.',
  es: '`shortcut` alinea un atajo de teclado o un metadato al final (como el menú "Edit" de MUI); `secondary` añade una segunda línea bajo el texto. `image` muestra una imagen de 24px en lugar de un icono.',
};

const AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' fill='%231565c0'/%3E%3Ctext x='12' y='16' font-size='10' text-anchor='middle' fill='white' font-family='Arial'%3EAG%3C/text%3E%3C/svg%3E";

export default function Demo() {
  const edit = useMenu();
  const account = useMenu();
  return (
    <div className="demo-row">
      <Button variant="outlined" {...edit.triggerProps}>
        Editar
      </Button>
      <Menu {...edit.menuProps}>
        <MenuItem icon="content_cut" shortcut="⌘X">
          Cortar
        </MenuItem>
        <MenuItem icon="content_copy" shortcut="⌘C">
          Copiar
        </MenuItem>
        <MenuItem icon="content_paste" shortcut="⌘V">
          Pegar
        </MenuItem>
        <MenuDivider />
        <MenuItem icon="cloud">Portapapeles web</MenuItem>
      </Menu>
      <Button variant="outlined" {...account.triggerProps}>
        Cambiar de cuenta
      </Button>
      <Menu {...account.menuProps}>
        <MenuItem image={AVATAR} secondary="ana@example.com" selected>
          Ana García
        </MenuItem>
        <MenuItem icon="person_add" secondary="Trabajo o personal">
          Añadir otra cuenta
        </MenuItem>
      </Menu>
    </div>
  );
}
