import { useRef, useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'Programmatic usage', es: 'Uso programático' };
export const description = {
  en: "In React the state lives in props: toggle `disabled` from your state and use `ref` to reach the DOM node. Button does not emit its own events: listen to the native `onClick`.",
  es: "En React el estado vive en las props: alterna `disabled` desde tu estado y usa `ref` para llegar al nodo DOM. Button no emite eventos propios: escucha el `onClick` nativo.",
};

export default function Demo() {
  const [disabled, setDisabled] = useState(false);
  const [extra, setExtra] = useState<number[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const ref = useRef<HTMLButtonElement>(null);
  const write = (text: string) =>
    setLog((lines) => [`[${new Date().toLocaleTimeString()}] ${text}`, ...lines].slice(0, 8));

  const changeDisabled = (value: boolean) => {
    setDisabled(value);
    write(`disabled = ${value}`);
  };

  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">Botón controlado</span>
        <div className="demo-row">
          <Button ref={ref} variant="contained" disabled={disabled} onClick={() => write('clic en "Botón controlado"')}>
            Botón controlado
          </Button>
        </div>
        <p className="demo-status">disabled: {String(disabled)}</p>
      </div>
      <div className="demo-group">
        <span className="demo-label">Acciones</span>
        <div className="demo-row">
          <Button variant="outlined" size="small" onClick={() => changeDisabled(true)}>
            Deshabilitar
          </Button>
          <Button variant="outlined" size="small" onClick={() => changeDisabled(false)}>
            Habilitar
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              ref.current?.focus();
              write('ref.current.focus()');
            }}
          >
            Enfocar (ref)
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setExtra((list) => [...list, list.length + 1]);
              write('nuevo <Button> renderizado');
            }}
          >
            Añadir botón
          </Button>
        </div>
        {extra.length ? (
          <div className="demo-row">
            {extra.map((n) => (
              <Button key={n} variant="outlined" size="small">
                Nuevo #{n}
              </Button>
            ))}
          </div>
        ) : null}
      </div>
      <div className="demo-group">
        <span className="demo-label">Registro de eventos</span>
        <pre className="demo-log" aria-live="polite">
          {log.join('\n')}
        </pre>
      </div>
    </div>
  );
}
