import { useEffect, useRef, useState } from 'react';
import { Tab, Tabs } from '@rubenchodev/materix-react/components/tabs';

export const title = { en: 'Several groups without an id', es: 'Varios grupos sin id' };
export const description = {
  en: "Without an `id`, each group gets a unique prefix from `useId`: tab ids are never repeated and `aria-controls` / `aria-labelledby` always point to the right element. The log lists the generated ids.",
  es: "Sin `id`, cada grupo recibe un prefijo único con `useId`: los ids de las pestañas nunca se repiten y `aria-controls` / `aria-labelledby` siempre apuntan al elemento correcto. El registro muestra los ids generados.",
};

export default function Demo() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [log, setLog] = useState('');

  useEffect(() => {
    const ids = Array.from(rootRef.current?.querySelectorAll('[role="tab"]') ?? []).map((tab) => tab.id);
    const unique = new Set(ids).size === ids.length;
    setLog(`ids: ${ids.join(', ')}\n${unique ? 'Sin duplicados ✓' : 'Ids duplicados ✗'}`);
  }, []);

  return (
    <div className="demo-stack" ref={rootRef}>
      <div className="demo-group">
        <span className="demo-label">Grupo A</span>
        <Tabs aria-label="Grupo A">
          <Tab label="Uno" />
          <Tab label="Dos" />
        </Tabs>
      </div>
      <div className="demo-group">
        <span className="demo-label">Grupo B</span>
        <Tabs aria-label="Grupo B">
          <Tab label="Uno" />
          <Tab label="Dos" />
        </Tabs>
      </div>
      <pre className="demo-log" aria-live="polite">
        {log}
      </pre>
    </div>
  );
}
