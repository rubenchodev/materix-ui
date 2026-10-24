import { Badge } from '@rubenchodev/materix-react/components/badge';
import { List, ListItemButton } from '@rubenchodev/materix-react/components/list';

export const title = { en: 'Inline (standalone)', es: 'En línea (standalone)' };
export const description = {
  en: '`standalone` shows the badge in the text flow, with no anchored element: useful for counters in navigation, lists or tabs. With content 0 it disappears (unless `showZero`). `label` adds text for screen readers (`{0}` = content).',
  es: '`standalone` muestra la insignia en el flujo del texto, sin elemento anclado: útil para contadores en navegación, listas o pestañas. Con contenido 0 desaparece (salvo `showZero`). `label` añade texto para lectores de pantalla (`{0}` = contenido).',
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Badge standalone badgeContent={4} color="primary" />
        <Badge standalone badgeContent={120} color="error" />
        <Badge standalone badgeContent="New" />
        <Badge standalone variant="dot" color="success" />
      </div>
      <div className="demo-fixed-width">
        <List aria-label="Folders">
          <li>
            <ListItemButton href="#standalone" icon="inbox" primary="Inbox" disableSelect>
              <Badge standalone badgeContent={4} color="primary" label="{0} unread" className="mtx-ms-auto" />
            </ListItemButton>
          </li>
          <li>
            <ListItemButton href="#standalone" icon="send" primary="Sent" disableSelect>
              <Badge standalone badgeContent={0} className="mtx-ms-auto" />
            </ListItemButton>
          </li>
        </List>
      </div>
    </div>
  );
}
