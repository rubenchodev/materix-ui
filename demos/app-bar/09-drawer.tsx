import { useId, useState } from 'react';
import { AppBar } from '@rubenchodev/materix-react/components/app-bar';
import { Drawer } from '@rubenchodev/materix-react/components/drawer';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';
import { List, ListItemButton } from '@rubenchodev/materix-react/components/list';

export const title = { en: 'With Drawer', es: 'Con Drawer' };
export const description = {
  en: '`onNavigationClick` opens the `Drawer`, and `navigationControls` / `navigationExpanded` keep `aria-controls` and `aria-expanded` of the navigation button in sync (the equivalent of vanilla `data-drawer="id"`).',
  es: '`onNavigationClick` abre el `Drawer`, y `navigationControls` / `navigationExpanded` mantienen sincronizados `aria-controls` y `aria-expanded` del botón de navegación (el equivalente de `data-drawer="id"` en vanilla).',
};

const items = [
  { icon: 'dashboard', label: 'Overview' },
  { icon: 'analytics', label: 'Analytics' },
  { icon: 'settings', label: 'Settings' },
];

export default function Demo() {
  const drawerId = `${useId().replace(/[^a-zA-Z0-9_-]/g, '')}-drawer`;
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('Overview');
  return (
    <div className="demo-stack">
      <AppBar
        position="static"
        color="primary"
        startIcon="menu"
        title="Dashboard with Drawer"
        navigationControls={drawerId}
        navigationExpanded={open}
        onNavigationClick={() => setOpen((value) => !value)}
      >
        <IconButton icon="notifications" aria-label="Notifications" />
      </AppBar>
      <Drawer id={drawerId} open={open} onClose={() => setOpen(false)} anchor="left" title="Dashboard">
        <List aria-label="Main navigation">
          {items.map(({ icon, label }) => (
            <li key={label}>
              <ListItemButton
                icon={icon}
                selected={selected === label}
                onClick={() => {
                  setSelected(label);
                  setOpen(false);
                }}
              >
                {label}
              </ListItemButton>
            </li>
          ))}
        </List>
      </Drawer>
    </div>
  );
}
