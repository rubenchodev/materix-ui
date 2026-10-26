import { List, ListItem, ListItemButton } from '@rubenchodev/materix-react/components/list';
import { Paper } from '@rubenchodev/materix-react/components/paper';

export const title = { en: 'States', es: 'Estados' };
export const description = {
  en: 'Hover to see the hover state and use Tab for focus. `disabled` disables the row (`disabled` on buttons, `aria-disabled` on links and static rows).',
  es: 'Pasa el ratón para ver el hover y usa Tab para el foco. `disabled` deshabilita la fila (`disabled` en botones, `aria-disabled` en enlaces y filas estáticas).',
};

export default function Demo() {
  return (
    <Paper variant="outlined" className="demo-fixed-width">
      <List aria-label="Estados" defaultValue="selected">
        <li>
          <ListItemButton icon="radio_button_unchecked">Normal</ListItemButton>
        </li>
        <li>
          <ListItemButton value="selected" icon="check_circle">
            Seleccionada
          </ListItemButton>
        </li>
        <li>
          <ListItemButton icon="block" disabled>
            Botón deshabilitado
          </ListItemButton>
        </li>
        <li>
          <ListItemButton href="#states" icon="link_off" disabled>
            Enlace deshabilitado
          </ListItemButton>
        </li>
        <ListItem icon="block" disabled>
          Fila estática deshabilitada
        </ListItem>
      </List>
    </Paper>
  );
}
