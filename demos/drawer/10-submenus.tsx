import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Drawer, DrawerSubmenu } from '@rubenchodev/materix-react/components/drawer';
import { List, ListItemButton } from '@rubenchodev/materix-react/components/list';

export const title = { en: 'Collapsible submenus', es: 'Submenús colapsables' };
export const description = {
  en: '`DrawerSubmenu` (vanilla `data-mtx-collapse-trigger` + `.mtx-collapse`) renders an item with `aria-expanded` and `aria-controls` that expands a nested list with `Collapse`; the `.mtx-collapse-indicator` rotates 90°. Controlled (`open` + `onToggle`) or uncontrolled (`defaultOpen`).',
  es: '`DrawerSubmenu` (`data-mtx-collapse-trigger` + `.mtx-collapse` de vanilla) renderiza un elemento con `aria-expanded` y `aria-controls` que despliega una lista anidada con `Collapse`; el `.mtx-collapse-indicator` rota 90°. Controlado (`open` + `onToggle`) o no controlado (`defaultOpen`).',
};

export default function Demo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="demo-row">
        <Button variant="contained" onClick={() => setOpen(true)}>
          Open with submenus
        </Button>
      </div>
      <Drawer open={open} onClose={() => setOpen(false)} title="Projects">
        <List component="nav" aria-label="Projects">
          <ListItemButton icon="dashboard" selected>
            Overview
          </ListItemButton>
          <DrawerSubmenu label="My projects" icon="folder" defaultOpen>
            <ListItemButton icon="language">Website</ListItemButton>
            <ListItemButton icon="smartphone">Mobile app</ListItemButton>
          </DrawerSubmenu>
          <DrawerSubmenu label="Reports" icon="analytics">
            <ListItemButton icon="trending_up">Conversions</ListItemButton>
            <ListItemButton icon="bar_chart">Billing</ListItemButton>
          </DrawerSubmenu>
        </List>
      </Drawer>
    </>
  );
}
