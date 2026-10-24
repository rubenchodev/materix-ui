import { useId, useState } from 'react';
import { AppBar } from '@rubenchodev/materix-react/components/app-bar';
import { Drawer, useDrawerMode } from '@rubenchodev/materix-react/components/drawer';
import type { DrawerBreakpoint, DrawerMode } from '@rubenchodev/materix-react/components/drawer';
import { List, ListItemButton } from '@rubenchodev/materix-react/components/list';
import { NativeSelect } from '@rubenchodev/materix-react/components/native-select';
import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = {
  en: 'Responsive: temporary on mobile, permanent on desktop',
  es: 'Responsive: temporal en móvil, permanente en escritorio',
};
export const description = {
  en: 'A single drawer with `variant="responsive"` and `breakpoint` (`sm` 600px, `md` 900px, `lg` 1200px, `xl` 1536px): temporary below it, permanent above it. Crossing the breakpoint syncs classes, ARIA, backdrop and focus and fires `onModeChange` (vanilla `mtx:drawer:mode-change`). `headerMode="temporary"` shows the header only on mobile.',
  es: 'Un único drawer con `variant="responsive"` y `breakpoint` (`sm` 600px, `md` 900px, `lg` 1200px, `xl` 1536px): temporal por debajo, permanente por encima. Al cruzar el breakpoint se sincronizan clases, ARIA, fondo y foco y se llama a `onModeChange` (`mtx:drawer:mode-change` en vanilla). `headerMode="temporary"` muestra la cabecera solo en móvil.',
};

const folders = [
  { icon: 'inbox', label: 'Inbox' },
  { icon: 'star', label: 'Starred' },
  { icon: 'send', label: 'Sent' },
  { icon: 'drafts', label: 'Drafts' },
];

export default function Demo() {
  const navId = useId();
  const [breakpoint, setBreakpoint] = useState<DrawerBreakpoint>('md');
  const [open, setOpen] = useState(false);
  const [folder, setFolder] = useState('Inbox');
  const [log, setLog] = useState<string[]>([]);
  const mode = useDrawerMode('responsive', breakpoint);

  const handleModeChange = (next: DrawerMode, previous: DrawerMode) =>
    setLog((lines) => [...lines.slice(-3), `onModeChange: ${previous} → ${next}`]);

  return (
    <div className="demo-stack demo-wide">
      <div className="demo-fixed-width">
        <NativeSelect
          label="Breakpoint"
          value={breakpoint}
          onChange={(event) => setBreakpoint(event.target.value as DrawerBreakpoint)}
        >
          <option value="sm">sm · 600px</option>
          <option value="md">md · 900px</option>
          <option value="lg">lg · 1200px</option>
          <option value="xl">xl · 1536px</option>
        </NativeSelect>
      </div>
      <div className="demo-panel demo-panel--tall mtx-w-100">
        <div className="mtx-d-flex mtx-flex-column" style={{ height: 380 }}>
          <AppBar
            position="static"
            color="primary"
            title="Mail"
            startIcon={mode === 'temporary' ? 'menu' : undefined}
            navigationControls={navId}
            navigationExpanded={open}
            onNavigationClick={() => setOpen((value) => !value)}
          />
          <div className="mtx-position-relative mtx-d-flex mtx-flex-1 mtx-overflow-hidden">
            <Drawer
              id={navId}
              variant="responsive"
              breakpoint={breakpoint}
              absolute
              width={220}
              title="Mail"
              headerMode="temporary"
              aria-label="Folders"
              open={open}
              onClose={() => setOpen(false)}
              onModeChange={handleModeChange}
            >
              <List component="nav" aria-label="Folders">
                {folders.map((item) => (
                  <ListItemButton
                    key={item.label}
                    icon={item.icon}
                    selected={folder === item.label}
                    data-mtx-drawer-close
                    onClick={() => setFolder(item.label)}
                  >
                    {item.label}
                  </ListItemButton>
                ))}
              </List>
            </Drawer>
            <main className="mtx-flex-1 mtx-min-w-0 mtx-p-2">
              <Typography variant="subtitle1" component="h3" gutterBottom>
                {folder}
              </Typography>
              <Typography variant="body2" color="text-secondary">
                Current mode: <span aria-live="polite">{mode}</span>. Resize the window.
              </Typography>
            </main>
          </div>
        </div>
      </div>
      <pre className="demo-log" aria-live="polite">
        {log.join('\n')}
      </pre>
    </div>
  );
}
