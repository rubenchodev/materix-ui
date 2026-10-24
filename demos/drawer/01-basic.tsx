import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Drawer } from '@rubenchodev/materix-react/components/drawer';
import { List, ListItemButton } from '@rubenchodev/materix-react/components/list';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: '`<Drawer open onClose title>` with its content directly inside: `title` generates the header and the close button, the content goes into the scrollable panel and the temporary drawer adds the backdrop. Close it with Escape, the backdrop or the X.',
  es: '`<Drawer open onClose title>` con el contenido directamente dentro: `title` genera la cabecera y el botón de cierre, el contenido va al panel desplazable y el drawer temporal añade el fondo. Ciérralo con Escape, el fondo o la X.',
};

export default function Demo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="demo-row">
        <Button variant="contained" onClick={() => setOpen(true)}>
          Open navigation
        </Button>
      </div>
      <Drawer open={open} onClose={() => setOpen(false)} title="Mail">
        <List component="nav" aria-label="Main navigation">
          <ListItemButton icon="inbox" href="#inbox" selected>
            Inbox
          </ListItemButton>
          <ListItemButton icon="star" href="#starred">
            Starred
          </ListItemButton>
          <ListItemButton icon="send" href="#sent">
            Sent
          </ListItemButton>
          <ListItemButton icon="drafts" href="#drafts">
            Drafts
          </ListItemButton>
        </List>
      </Drawer>
    </>
  );
}
