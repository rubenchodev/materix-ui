import type { ReactNode } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Drawer, useDrawer } from '@rubenchodev/materix-react/components/drawer';
import { List, ListItemButton } from '@rubenchodev/materix-react/components/list';
import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'Variants', es: 'Variantes' };
export const description = {
  en: '`temporary` (default: modal with a backdrop, locks scrolling and traps focus), `persistent` (no backdrop; the page stays usable) and `permanent` (always visible). Here they are contained in a frame with `absolute`, which in `permanent` takes the container height instead of the window.',
  es: '`temporary` (por defecto: modal con fondo, bloquea el scroll y atrapa el foco), `persistent` (sin fondo; la página sigue usable) y `permanent` (siempre visible). Aquí están contenidos en un marco con `absolute`, que en `permanent` toma el alto del contenedor en lugar del de la ventana.',
};

/** Navegación de muestra. */
function Nav({ label }: { label: string }) {
  return (
    <List component="nav" aria-label={label}>
      <ListItemButton icon="inbox" selected>
        Inbox
      </ListItemButton>
      <ListItemButton icon="star">Starred</ListItemButton>
      <ListItemButton icon="send">Sent</ListItemButton>
    </List>
  );
}

/** Marco contenido de 320px con su etiqueta. */
function Frame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="demo-group">
      <span className="demo-label">{label}</span>
      <div className="demo-panel demo-panel--tall">
        <div className="mtx-position-relative mtx-d-flex mtx-overflow-hidden" style={{ height: 320 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function Demo() {
  const temporary = useDrawer();
  const persistent = useDrawer();
  return (
    <div className="demo-grid-3 mtx-w-100">
      <Frame label="temporary · absolute">
        <div className="mtx-flex-1 mtx-min-w-0 mtx-p-2">
          <Button variant="outlined" {...temporary.getTriggerProps({ action: 'open' })}>
            Open
          </Button>
          <Typography variant="body2" color="text-secondary" className="mtx-mt-1">
            Semi-transparent backdrop; click outside or press Escape to close.
          </Typography>
        </div>
        <Drawer absolute width="narrow" title="Temporary" {...temporary.drawerProps}>
          <Nav label="Temporary navigation" />
        </Drawer>
      </Frame>
      <Frame label="persistent · absolute">
        <Drawer
          variant="persistent"
          absolute
          width="narrow"
          title="Persistent"
          {...persistent.drawerProps}
        >
          <Nav label="Persistent navigation" />
        </Drawer>
        <div className="mtx-flex-1 mtx-min-w-0 mtx-p-2 mtx-d-flex mtx-flex-column mtx-align-items-end">
          <Button variant="outlined" {...persistent.getTriggerProps()}>
            Toggle
          </Button>
          <Typography variant="body2" color="text-secondary" align="right" className="mtx-mt-1">
            No backdrop: the content stays interactive.
          </Typography>
        </div>
      </Frame>
      <Frame label="permanent · absolute">
        <Drawer variant="permanent" absolute width="narrow" title="Permanent">
          <Nav label="Permanent navigation" />
        </Drawer>
        <div className="mtx-flex-1 mtx-min-w-0 mtx-p-2">
          <Typography variant="body2" color="text-secondary">
            Always visible, with no animation or backdrop.
          </Typography>
        </div>
      </Frame>
    </div>
  );
}
