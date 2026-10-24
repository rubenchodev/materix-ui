import { useId, useState } from 'react';
import { AppBar } from '@rubenchodev/materix-react/components/app-bar';
import { Drawer, useDrawerMode } from '@rubenchodev/materix-react/components/drawer';
import { List, ListItemButton, ListSubheader } from '@rubenchodev/materix-react/components/list';
import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'App shell: AppBar + responsive Drawer', es: 'App shell: AppBar + Drawer responsive' };
export const description = {
  en: 'The main recipe for an application: an AppBar whose menu button controls the drawer (`navigationControls`, `navigationExpanded`, `onNavigationClick`, the React form of vanilla `data-drawer`) and a `variant="responsive"` drawer. `useDrawerMode` hides the menu button while the drawer is permanent. Resize the window below 900px.',
  es: 'La receta principal de una aplicación: una AppBar cuyo botón de menú controla el drawer (`navigationControls`, `navigationExpanded`, `onNavigationClick`, la forma React de `data-drawer` de vanilla) y un drawer `variant="responsive"`. `useDrawerMode` oculta el botón de menú mientras el drawer es permanente. Reduce la ventana por debajo de 900px.',
};

const sections = [
  { icon: 'dashboard', label: 'Overview' },
  { icon: 'receipt_long', label: 'Orders' },
  { icon: 'people', label: 'Customers' },
  { icon: 'bar_chart', label: 'Reports' },
];

export default function Demo() {
  const navId = useId();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState('Overview');
  // El mismo hook que usa el Drawer: en permanente el botón de menú sobra.
  const mode = useDrawerMode('responsive', 'md');

  return (
    <div className="demo-panel demo-panel--tall mtx-w-100">
      <div className="mtx-d-flex mtx-flex-column" style={{ height: 440 }}>
        <AppBar
          position="static"
          color="primary"
          title="My app"
          startIcon={mode === 'temporary' ? 'menu' : undefined}
          navigationControls={navId}
          navigationExpanded={open}
          onNavigationClick={() => setOpen((value) => !value)}
        />
        <div className="mtx-position-relative mtx-d-flex mtx-flex-1 mtx-min-w-0 mtx-overflow-hidden">
          <Drawer
            id={navId}
            variant="responsive"
            breakpoint="md"
            absolute
            width={240}
            title="My app"
            headerMode="temporary"
            aria-label="Main navigation"
            open={open}
            onClose={() => setOpen(false)}
          >
            <List component="nav" aria-label="Sections" subheader={<ListSubheader component="div">Store</ListSubheader>}>
              {sections.map((section) => (
                <ListItemButton
                  key={section.label}
                  icon={section.icon}
                  selected={current === section.label}
                  data-mtx-drawer-close
                  onClick={() => setCurrent(section.label)}
                >
                  {section.label}
                </ListItemButton>
              ))}
            </List>
            <div className="mtx-mt-auto mtx-p-2">
              <Typography variant="caption" color="text-secondary">
                v0.1.0 · Signed in as Emma
              </Typography>
            </div>
          </Drawer>
          <main className="mtx-flex-1 mtx-min-w-0 mtx-overflow-auto mtx-p-2">
            <Typography variant="h6" component="h3" gutterBottom>
              {current}
            </Typography>
            <Typography variant="body2" color="text-secondary">
              Mode: <strong>{mode}</strong>. Below 900px the drawer is temporary and the AppBar menu button opens it;
              from 900px it is permanent and the button hides itself.
            </Typography>
          </main>
        </div>
      </div>
    </div>
  );
}
