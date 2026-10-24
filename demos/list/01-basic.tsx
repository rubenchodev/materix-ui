import { List, ListItem } from '@rubenchodev/materix-react/components/list';
import { Paper } from '@rubenchodev/materix-react/components/paper';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: 'A `List` with `ListItem` rows. `icon` adds the icon and `secondary` the secondary text; text children are the primary text.',
  es: 'Una `List` con filas `ListItem`. `icon` añade el icono y `secondary` el texto secundario; los hijos de texto son el texto principal.',
};

export default function Demo() {
  return (
    <Paper variant="outlined" className="demo-fixed-width">
      <List aria-label="Mail">
        <ListItem icon="inbox" secondary="3 new messages">
          Inbox
        </ListItem>
        <ListItem icon="drafts" secondary="Saved 2 hours ago">
          Drafts
        </ListItem>
        <ListItem icon="send">Sent</ListItem>
      </List>
    </Paper>
  );
}
