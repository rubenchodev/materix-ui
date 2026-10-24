import { useId, useState } from 'react';
import { Collapse } from '@rubenchodev/materix-react';
import { List, ListItemButton } from '@rubenchodev/materix-react/components/list';
import { Paper } from '@rubenchodev/materix-react/components/paper';

export const title = { en: 'Nested', es: 'Anidadas' };
export const description = {
  en: 'A `List nested` inside a row indents its rows by 48px and shares the parent selection. `Collapse` expands and collapses it; the parent row uses `aria-expanded` and `disableSelect`.',
  es: 'Una `List nested` dentro de una fila sangra sus filas 48px y comparte la selección del padre. `Collapse` la despliega y pliega; la fila padre usa `aria-expanded` y `disableSelect`.',
};

export default function Demo() {
  const [open, setOpen] = useState(true);
  const nestedId = useId();
  return (
    <Paper variant="outlined" className="demo-fixed-width">
      <List aria-label="Folders">
        <li>
          <ListItemButton
            icon="inbox"
            primary="Inbox"
            disableSelect
            aria-expanded={open}
            aria-controls={nestedId}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="material-icons" aria-hidden="true">
              {open ? 'expand_less' : 'expand_more'}
            </span>
          </ListItemButton>
          <Collapse in={open}>
            <List nested id={nestedId} aria-label="Subfolders">
              <li>
                <ListItemButton icon="star_border">Starred</ListItemButton>
              </li>
              <li>
                <ListItemButton icon="label">Invoices</ListItemButton>
              </li>
            </List>
          </Collapse>
        </li>
        <li>
          <ListItemButton icon="send">Sent</ListItemButton>
        </li>
      </List>
    </Paper>
  );
}
