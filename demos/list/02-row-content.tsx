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
        <span className="demo-label">Without icon · with icon</span>
        <Paper variant="outlined">
          <List aria-label="Without and with icon">
            <ListItem>Text only</ListItem>
            <ListItem secondary="With secondary text">Text only</ListItem>
            <ListItem icon="star">With icon</ListItem>
            <ListItem icon="star" secondary="With secondary text">
              With icon
            </ListItem>
          </List>
        </Paper>
      </div>
      <div className="demo-group">
        <span className="demo-label">Avatar · top alignment</span>
        <Paper variant="outlined">
          <List aria-label="Contacts">
            <ListItem avatar="https://i.pravatar.cc/120?img=5" secondary="anna@example.com">
              Anna Garcia
            </ListItem>
            <ListItem avatar={<Avatar color="primary">CR</Avatar>} secondary="charles@example.com">
              Charles Reed
            </ListItem>
            <ListItem
              alignItems="flex-start"
              avatar={<Avatar color="secondary">LM</Avatar>}
              secondary="Here is the meeting summary with the agreements, owners and due dates."
            >
              Monday recap
            </ListItem>
          </List>
        </Paper>
      </div>
    </div>
  );
}
