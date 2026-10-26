import { useState } from 'react';
import { Breadcrumbs } from '@rubenchodev/materix-react/components/breadcrumbs';
import { Button } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'Programmatic usage: folder navigation', es: 'Uso programático: navegación de carpetas' };
export const description = {
  en: "Folder navigation with `items`: `onNavigate` calls `preventDefault()` and moves to the chosen level; `onExpand` reports the collapse button.",
  es: "Navegación de carpetas con `items`: `onNavigate` llama a `preventDefault()` y va al nivel elegido; `onExpand` informa del botón de colapso.",
};

const FOLDERS = ['Mi unidad', 'Proyectos', 'Cliente Andina', 'Entregables', 'Informe T3'];

export default function Demo() {
  const [depth, setDepth] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const write = (text: string) => setLog((lines) => [text, ...lines].slice(0, 6));

  const items = FOLDERS.slice(0, depth + 1).map((name, index) => ({
    label: name,
    icon: index === 0 ? 'folder' : undefined,
    data: { depth: index },
  }));

  return (
    <div className="demo-stack">
      <Breadcrumbs
        separator="chevron_right"
        maxItems={4}
        items={items}
        aria-label="Carpetas"
        onExpand={() => write('onExpand')}
        onNavigate={(event, detail) => {
          event.preventDefault();
          setDepth(detail.index);
          write(`onNavigate → índice ${detail.index} (${detail.label})`);
        }}
      />
      <div className="demo-row">
        <Button
          variant="outlined"
          disabled={depth >= FOLDERS.length - 1}
          onClick={() => {
            setDepth(depth + 1);
            write(`abrir "${FOLDERS[depth + 1]}"`);
          }}
        >
          Abrir subcarpeta
        </Button>
        <Button variant="text" disabled={depth === 0} onClick={() => setDepth(0)}>
          Restablecer
        </Button>
      </div>
      <pre className="demo-log" aria-live="polite">
        {log.join('\n')}
      </pre>
    </div>
  );
}
