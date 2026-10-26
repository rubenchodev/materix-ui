import '@rubenchodev/materix-ui/utilities.css';
import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { SpeedDial, SpeedDialAction } from '@rubenchodev/materix-react/components/speed-dial';

export const title = { en: 'Hidden and position', es: 'Oculto y posición' };
export const description = {
  en: '`hidden` shrinks the main FAB to zero and closes the actions (for example while scrolling). `position="fixed-br"` and `"fixed-bl"` pin the SpeedDial 24px from the bottom-right or bottom-left corner of the window.',
  es: '`hidden` encoge el FAB principal hasta cero y cierra las acciones (por ejemplo al hacer scroll). `position="fixed-br"` y `"fixed-bl"` fijan el SpeedDial a 24px de la esquina inferior derecha o izquierda de la ventana.',
};

/** Esquina inferior derecha del panel (utilidades de posición). */
const corner = 'mtx-position-absolute mtx-right-0 mtx-bottom-0 mtx-m-2';

export default function Demo() {
  const [hidden, setHidden] = useState(false);
  return (
    <div className="demo-group">
      <div className="demo-row">
        <Button variant="outlined" size="small" aria-pressed={hidden} onClick={() => setHidden((value) => !value)}>
          hidden
        </Button>
        <span className="demo-status">hidden: {String(hidden)}</span>
      </div>
      <div className="demo-panel demo-panel--tall">
        <SpeedDial ariaLabel="Acciones ocultables" hidden={hidden} className={corner}>
          <SpeedDialAction icon="mail" tooltipTitle="Correo" />
          <SpeedDialAction icon="event" tooltipTitle="Evento" />
        </SpeedDial>
      </div>
    </div>
  );
}
