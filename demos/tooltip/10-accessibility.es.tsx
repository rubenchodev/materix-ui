import { useEffect, useRef, useState } from 'react';
import { Tooltip } from '@rubenchodev/materix-react/components/tooltip';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';

export const title = { en: 'Accessibility', es: 'Accesibilidad' };
export const description = {
  en: 'Without an accessible name the title becomes the `aria-label`; with a name, the tooltip describes the trigger with `aria-describedby` while visible. It is hoverable, dismissible with `Escape` and opens with a 700 ms long press on touch screens.',
  es: 'Sin nombre accesible el título pasa a ser el `aria-label`; con nombre, el tooltip describe al disparador con `aria-describedby` mientras es visible. Se puede pasar el puntero sobre él, se descarta con `Escape` y en táctil abre con una pulsación larga de 700 ms.',
};

export default function Demo() {
  const unnamed = useRef<HTMLElement>(null);
  const [label, setLabel] = useState('');
  useEffect(() => {
    setLabel(unnamed.current?.getAttribute('aria-label') || '');
  }, []);
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">Sin nombre → aria-label</span>
        <div className="demo-row">
          <Tooltip title="Imprimir" ref={unnamed}>
            <IconButton icon="print" />
          </Tooltip>
          <span className="demo-status">aria-label=&quot;{label}&quot;</span>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Con nombre → aria-describedby</span>
        <div className="demo-row">
          <Tooltip title="Usa la impresora predeterminada">
            <IconButton icon="print" aria-label="Imprimir factura" />
          </Tooltip>
          <span className="demo-status">aria-label=&quot;Imprimir factura&quot;</span>
        </div>
      </div>
    </div>
  );
}
