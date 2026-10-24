import { Button } from '@rubenchodev/materix-react/components/button';
import { Menu, MenuDivider, MenuItem, useMenu } from '@rubenchodev/materix-react/components/menu';

export const title = { en: 'Dividers', es: 'Separadores' };
export const description = {
  en: 'Group options with `<MenuDivider />` or with `<MenuItem divider />`: both are separators (`role="separator"`) that the keyboard does not focus.',
  es: 'Agrupa opciones con `<MenuDivider />` o con `<MenuItem divider />`: ambos son separadores (`role="separator"`) que el teclado no enfoca.',
};

export default function Demo() {
  const menu = useMenu();
  return (
    <div className="demo-row">
      <Button variant="outlined" {...menu.triggerProps}>
        File
      </Button>
      <Menu {...menu.menuProps}>
        <MenuItem icon="description">New</MenuItem>
        <MenuItem icon="folder_open">Open…</MenuItem>
        <MenuDivider />
        <MenuItem icon="save">Save</MenuItem>
        <MenuItem icon="print">Print</MenuItem>
        <MenuItem divider />
        <MenuItem icon="logout">Close</MenuItem>
      </Menu>
    </div>
  );
}
