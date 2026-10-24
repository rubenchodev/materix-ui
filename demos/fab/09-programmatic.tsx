import { Button } from '@rubenchodev/materix-react/components/button';
import { useState } from 'react';
import { Fab } from '@rubenchodev/materix-react/components/fab';
import type { FabColor, FabSize } from '@rubenchodev/materix-react/components/fab';

export const title = { en: 'Programmatic usage', es: 'Uso programático' };
export const description = {
  en: 'The vanilla `size`/`color` setters and `disable()`/`enable()` become props driven by state. Fab emits no events of its own: use `onClick`.',
  es: 'Los setters `size`/`color` y `disable()`/`enable()` de vanilla pasan a ser props controladas por estado. Fab no emite eventos propios: usa `onClick`.',
};

const sizes: FabSize[] = ['small', 'medium', 'large'];
const colors: FabColor[] = ['primary', 'secondary', 'success'];

export default function Demo() {
  const [size, setSize] = useState<FabSize>('large');
  const [color, setColor] = useState<FabColor>('primary');
  const [disabled, setDisabled] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const write = (message: string) =>
    setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev].slice(0, 20));

  return (
    <>
      <div className="demo-group">
        <span className="demo-label">Controlled FAB</span>
        <div className="demo-row">
          <Fab
            icon="bolt"
            aria-label="Quick action"
            size={size}
            color={color}
            disabled={disabled}
            onClick={() => write('click on "Quick action"')}
          />
          <span className="demo-status">
            size: {size} · color: {color} · disabled: {String(disabled)}
          </span>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Actions</span>
        <div className="demo-row">
          {sizes.map((value) => (
            <Button
              key={value}
              variant="outlined" size="small"
              onClick={() => {
                setSize(value);
                write(`size = '${value}'`);
              }}
            >
              size = &apos;{value}&apos;
            </Button>
          ))}
        </div>
        <div className="demo-row">
          {colors.map((value) => (
            <Button
              key={value}
              variant="outlined" size="small"
              onClick={() => {
                setColor(value);
                write(`color = '${value}'`);
              }}
            >
              color = &apos;{value}&apos;
            </Button>
          ))}
        </div>
        <div className="demo-row">
          {[true, false].map((value) => (
            <Button
              key={String(value)}
              variant="outlined" size="small"
              onClick={() => {
                setDisabled(value);
                write(`disabled = ${value}`);
              }}
            >
              disabled = {String(value)}
            </Button>
          ))}
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Event log</span>
        <pre className="demo-log" aria-live="polite">
          {log.join('\n')}
        </pre>
      </div>
    </>
  );
}
