import { Button } from '@rubenchodev/materix-react/components/button';
import { Menu, MenuItem, useMenu } from '@rubenchodev/materix-react/components/menu';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: '`useMenu()` connects a trigger with a `Menu`: it toggles on click, focuses the first item when opened with the keyboard and keeps `aria-expanded`/`aria-controls` up to date. It closes when an option is chosen, on a click outside, with Escape or with Tab.',
  es: '`useMenu()` conecta un disparador con un `Menu`: alterna al hacer clic, enfoca el primer ítem si se abre con teclado y mantiene `aria-expanded`/`aria-controls`. Se cierra al elegir una opción, con un clic fuera, con Escape o con Tab.',
};

export default function Demo() {
  const menu = useMenu();
  return (
    <div className="demo-row">
      <Button variant="contained" {...menu.triggerProps}>
        Abrir menú
      </Button>
      <Menu {...menu.menuProps}>
        <MenuItem>Perfil</MenuItem>
        <MenuItem>Mi cuenta</MenuItem>
        <MenuItem>Cerrar sesión</MenuItem>
      </Menu>
    </div>
  );
}
