import { AppBar } from '@rubenchodev/materix-react/components/app-bar';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';
import { Menu, MenuDivider, MenuItem, useMenu } from '@rubenchodev/materix-react/components/menu';

export const title = { en: 'Real-world example', es: 'Ejemplo real' };
export const description = {
  en: 'Account menu in an app bar: aligned to the end of the icon (`placement="bottom-end"`).',
  es: 'Menú de cuenta en una barra de aplicación: alineado al final del icono (`placement="bottom-end"`).',
};

export default function Demo() {
  const menu = useMenu();
  return (
    <div className="demo-stack">
      <AppBar position="static" title="Mi aplicación">
        <IconButton icon="account_circle" color="inherit" aria-label="Cuenta de Ana García" {...menu.triggerProps} />
      </AppBar>
      <Menu {...menu.menuProps} placement="bottom-end">
        <MenuItem icon="person">Perfil</MenuItem>
        <MenuItem icon="settings">Ajustes</MenuItem>
        <MenuDivider />
        <MenuItem icon="logout">Cerrar sesión</MenuItem>
      </Menu>
    </div>
  );
}
