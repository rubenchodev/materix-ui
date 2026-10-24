import { useState } from 'react';
import type { MouseEvent } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';
import { List, ListItem } from '@rubenchodev/materix-react/components/list';
import { Paper } from '@rubenchodev/materix-react/components/paper';
import { Menu, MenuDivider, MenuItem } from '@rubenchodev/materix-react/components/menu';

export const title = { en: 'Triggers', es: 'Disparadores' };
export const description = {
  en: 'One shared `Menu` for every row: each `more_vert` button stores itself as `anchorEl` (MUI pattern), so rows added later work too. Click "Add row" and open the new row menu.',
  es: 'Un único `Menu` compartido por todas las filas: cada botón `more_vert` se guarda como `anchorEl` (patrón MUI), así que también funcionan las filas añadidas después. Pulsa "Add row" y abre el menú de la nueva fila.',
};

export default function Demo() {
  const [rows, setRows] = useState([
    { name: 'Annual report.pdf', size: '2.4 MB' },
    { name: 'Budget.xlsx', size: '310 KB' },
  ]);
  const [anchor, setAnchor] = useState<{ el: HTMLElement; name: string } | null>(null);
  const [log, setLog] = useState<string[]>([]);

  const openFor = (name: string) => (event: MouseEvent<HTMLElement>) => {
    const el = event.currentTarget;
    setAnchor((prev) => (prev?.el === el ? null : { el, name }));
  };

  return (
    <div className="demo-stack">
      <Paper variant="outlined" className="demo-wide">
        <List aria-label="Files">
          {rows.map((row) => (
            <ListItem
              key={row.name}
              icon="description"
              secondary={row.size}
              secondaryAction={
                <IconButton
                  icon="more_vert"
                  aria-label={`Actions for ${row.name}`}
                  aria-haspopup="menu"
                  aria-expanded={anchor?.name === row.name}
                  aria-controls={anchor?.name === row.name ? 'menu-row-actions' : undefined}
                  onClick={openFor(row.name)}
                />
              }
            >
              {row.name}
            </ListItem>
          ))}
        </List>
      </Paper>
      <Menu
        id="menu-row-actions"
        open={anchor !== null}
        anchorEl={anchor?.el}
        onClose={() => setAnchor(null)}
        onSelect={({ value }) => setLog((lines) => [`${value} → ${anchor?.name}`, ...lines].slice(0, 5))}
      >
        <MenuItem icon="edit" value="rename">
          Rename
        </MenuItem>
        <MenuItem icon="content_copy" value="duplicate">
          Duplicate
        </MenuItem>
        <MenuDivider />
        <MenuItem icon="delete" value="delete">
          Delete
        </MenuItem>
      </Menu>
      <div className="demo-row">
        <Button
          variant="outlined"
          startIcon="add"
          onClick={() => setRows((list) => [...list, { name: `New file ${list.length + 1}.txt`, size: '1 KB' }])}
        >
          Add row
        </Button>
      </div>
      <pre className="demo-log" aria-live="polite">
        {log.join('\n')}
      </pre>
    </div>
  );
}
