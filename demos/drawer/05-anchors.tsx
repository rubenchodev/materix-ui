import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Drawer } from '@rubenchodev/materix-react/components/drawer';
import type { DrawerAnchor } from '@rubenchodev/materix-react/components/drawer';
import { List, ListItemButton } from '@rubenchodev/materix-react/components/list';

export const title = { en: 'Anchors', es: 'Anclas' };
export const description = {
  en: '`anchor="left" | "right" | "top" | "bottom"`. `right` is usually used for details or filters; `top` and `bottom` take the full width and fit their content (bottom sheet). `data-mtx-drawer-close` on any element inside closes it.',
  es: '`anchor="left" | "right" | "top" | "bottom"`. `right` suele usarse para detalles o filtros; `top` y `bottom` ocupan todo el ancho y se ajustan a su contenido (bottom sheet). `data-mtx-drawer-close` en cualquier elemento interior lo cierra.',
};

const icons: Record<DrawerAnchor, string> = { left: 'west', right: 'east', top: 'north', bottom: 'south' };

export default function Demo() {
  const [open, setOpen] = useState<DrawerAnchor | null>(null);
  const close = () => setOpen(null);
  return (
    <div className="demo-row">
      {(Object.keys(icons) as DrawerAnchor[]).map((anchor) => (
        <Button key={anchor} variant="outlined" startIcon={icons[anchor]} onClick={() => setOpen(anchor)}>
          {anchor}
        </Button>
      ))}
      <Drawer anchor="left" title="left" open={open === 'left'} onClose={close}>
        <List component="nav" aria-label="Navigation (left)">
          <ListItemButton icon="inbox" selected>
            Inbox
          </ListItemButton>
          <ListItemButton icon="star">Starred</ListItemButton>
          <ListItemButton icon="send">Sent</ListItemButton>
          <ListItemButton icon="drafts">Drafts</ListItemButton>
        </List>
      </Drawer>
      <Drawer anchor="right" title="Details" padded open={open === 'right'} onClose={close}>
        <p>Details panel anchored to the right.</p>
        <Button variant="contained" data-mtx-drawer-close>
          OK
        </Button>
      </Drawer>
      <Drawer anchor="top" title="Notice" padded open={open === 'top'} onClose={close}>
        <p>Top panel for global notices.</p>
        <Button data-mtx-drawer-close>Got it</Button>
      </Drawer>
      <Drawer anchor="bottom" title="Share" open={open === 'bottom'} onClose={close}>
        <List component="nav" aria-label="Share options">
          <ListItemButton icon="mail">Email</ListItemButton>
          <ListItemButton icon="link">Copy link</ListItemButton>
          <ListItemButton icon="qr_code">QR code</ListItemButton>
        </List>
      </Drawer>
    </div>
  );
}
