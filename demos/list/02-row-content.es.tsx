import { Avatar } from '@rubenchodev/materix-react/components/avatar';
import { List, ListItem } from '@rubenchodev/materix-react/components/list';
import { Paper } from '@rubenchodev/materix-react/components/paper';

export const title = { en: 'Row content', es: 'Contenido de la fila' };
export const description = {
  en: 'Text only, with an icon, with an avatar and with primary and secondary text. `avatar` accepts an image URL or an `Avatar`, wrapped in `ListItemAvatar` (56px); `alignItems="flex-start"` aligns it with the first line.',
  es: 'Solo texto, con icono, con avatar y con texto principal y secundario. `avatar` acepta una URL de imagen o un `Avatar`, envuelto en `ListItemAvatar` (56px); `alignItems="flex-start"` lo alinea con la primera línea.',
};

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">Sin icono · con icono</span>
        <Paper variant="outlined">
          <List aria-label="Sin y con icono">
            <ListItem>Solo texto</ListItem>
            <ListItem secondary="Con texto secundario">Solo texto</ListItem>
            <ListItem icon="star">Con icono</ListItem>
            <ListItem icon="star" secondary="Con texto secundario">
              Con icono
            </ListItem>
          </List>
        </Paper>
      </div>
      <div className="demo-group">
        <span className="demo-label">Avatar · alineación superior</span>
        <Paper variant="outlined">
          <List aria-label="Contactos">
            <ListItem avatar="https://i.pravatar.cc/120?img=5" secondary="ana@example.com">
              Ana García
            </ListItem>
            <ListItem avatar={<Avatar color="primary">CR</Avatar>} secondary="carlos@example.com">
              Carlos Ruiz
            </ListItem>
            <ListItem
              alignItems="flex-start"
              avatar={<Avatar color="secondary">LM</Avatar>}
              secondary="Te comparto el resumen de la reunión con los acuerdos, responsables y fechas límite."
            >
              Resumen del lunes
            </ListItem>
          </List>
        </Paper>
      </div>
    </div>
  );
}
