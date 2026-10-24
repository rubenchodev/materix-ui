import { Divider } from '@rubenchodev/materix-react/components/divider';
import { List, ListItem } from '@rubenchodev/materix-react/components/list';
import { Paper } from '@rubenchodev/materix-react/components/paper';

export const title = { en: 'In lists', es: 'En listas' };
export const description = {
  en: 'Use `component="li"` to keep the HTML valid; `inset` aligns the line with the text. Inside a list the divider keeps the list item role (no `role="separator"`) and the empty one is hidden from screen readers with `aria-hidden="true"`. Alternatively, `divider` on each `ListItem` draws a bottom border.',
  es: 'Usa `component="li"` para que el HTML sea válido; `inset` alinea la línea con el texto. Dentro de una lista el divisor conserva el rol de elemento de lista (sin `role="separator"`) y, vacío, se oculta a los lectores de pantalla con `aria-hidden="true"`. Como alternativa, `divider` en cada `ListItem` dibuja un borde inferior.',
};

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">Inset divider between items</span>
        <Paper variant="outlined">
          <List aria-label="Mailbox">
            <ListItem icon="inbox">Inbox</ListItem>
            <Divider component="li" variant="inset" />
            <ListItem icon="drafts">Drafts</ListItem>
            <Divider component="li" variant="inset" />
            <ListItem icon="send">Sent</ListItem>
          </List>
        </Paper>
      </div>
      <div className="demo-group">
        <span className="demo-label">divider on the items</span>
        <Paper variant="outlined">
          <List aria-label="Folders">
            <ListItem icon="folder" divider>
              Documents
            </ListItem>
            <ListItem icon="image" divider>
              Photos
            </ListItem>
            <ListItem icon="videocam">Videos</ListItem>
          </List>
        </Paper>
      </div>
    </div>
  );
}
