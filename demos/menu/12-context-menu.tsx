import { useRef, useState } from 'react';
import { ContextMenu, Menu, MenuItem, useContextMenu } from '@rubenchodev/materix-react/components/menu';

export const title = { en: 'Context menu', es: 'Menú contextual' };
export const description = {
  en: '`<ContextMenu target items>` is the equivalent of `Menu.createContextMenu(selector, items)`: it builds the menu from data and opens it on right-click at the pointer position (with the Menu key or Shift+F10 it anchors to the area). For full control, `useContextMenu()` returns `onContextMenu` and the props for a `Menu`.',
  es: '`<ContextMenu target items>` equivale a `Menu.createContextMenu(selector, items)`: construye el menú a partir de datos y lo abre con clic derecho en la posición del puntero (con la tecla Menú o Mayús+F10 se ancla al área). Para control total, `useContextMenu()` devuelve `onContextMenu` y las props de un `Menu`.',
};

export default function Demo() {
  const areaRef = useRef<HTMLDivElement>(null);
  const [log, setLog] = useState<string[]>([]);
  const write = (text: string) => setLog((lines) => [text, ...lines].slice(0, 5));
  const custom = useContextMenu();

  return (
    <div className="demo-stack">
      <div ref={areaRef} className="demo-panel" tabIndex={0} role="region" aria-label="Context menu area">
        Right-click here (ContextMenu)
      </div>
      <ContextMenu
        target={areaRef}
        items={[
          { label: 'Copy', icon: 'content_copy', shortcut: '⌘C', action: () => write('Copy') },
          { label: 'Paste', icon: 'content_paste', disabled: true },
          { divider: true },
          {
            label: 'Share',
            icon: 'share',
            submenu: [
              { label: 'Email', icon: 'mail', action: () => write('Share → Email') },
              { label: 'Copy link', icon: 'link', action: () => write('Share → Copy link') },
            ],
          },
        ]}
      />
      <div
        className="demo-panel"
        tabIndex={0}
        role="region"
        aria-label="Custom context menu area"
        onContextMenu={custom.onContextMenu}
      >
        Right-click here (useContextMenu)
      </div>
      <Menu {...custom.menuProps} onSelect={({ value }) => value && write(`useContextMenu → ${value}`)}>
        <MenuItem icon="refresh" value="reload">
          Reload
        </MenuItem>
        <MenuItem icon="print" value="print">
          Print
        </MenuItem>
      </Menu>
      <pre className="demo-log" aria-live="polite">
        {log.join('\n')}
      </pre>
    </div>
  );
}
