import { useRef, useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';

export const title = { en: 'Programmatic usage', es: 'Uso programático' };
export const description = {
  en: 'In React the state lives in props: `disabled` replaces `disable()`/`enable()` and `ref` points to the DOM element. IconButton emits no events of its own: use `onClick`.',
  es: 'En React el estado vive en las props: `disabled` sustituye a `disable()`/`enable()` y `ref` apunta al elemento DOM. IconButton no emite eventos propios: usa `onClick`.',
};

const icons = ['bookmark', 'push_pin', 'flag', 'label'];

export default function Demo() {
  const [disabled, setDisabled] = useState(false);
  const [extra, setExtra] = useState<string[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const ref = useRef<HTMLElement>(null);

  const write = (message: string) =>
    setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev].slice(0, 20));

  const toggle = (value: boolean) => {
    setDisabled(value);
    write(`disabled = ${value}`);
  };

  const add = () => {
    const icon = icons[extra.length % icons.length];
    setExtra((prev) => [...prev, icon]);
    write(`render <IconButton icon="${icon}" /> · ref.current: <${ref.current?.tagName.toLowerCase()}>`);
  };

  return (
    <>
      <div className="demo-group">
        <span className="demo-label">Controlled button</span>
        <div className="demo-row">
          <IconButton
            ref={ref}
            icon="favorite"
            color="error"
            aria-label="Like"
            disabled={disabled}
            onClick={() => write('click on "Like"')}
          />
          <span className="demo-status">disabled: {String(disabled)}</span>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Actions</span>
        <div className="demo-row">
          <Button variant="outlined" size="small" onClick={() => toggle(true)}>
            disabled = true
          </Button>
          <Button variant="outlined" size="small" onClick={() => toggle(false)}>
            disabled = false
          </Button>
          <Button variant="outlined" size="small" onClick={add}>
            Add button
          </Button>
        </div>
        <div className="demo-row">
          {extra.map((icon, index) => (
            <IconButton key={index} icon={icon} aria-label={`Action ${index + 1}`} />
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
