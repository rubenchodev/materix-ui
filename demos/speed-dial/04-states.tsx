import '@rubenchodev/materix-ui/utilities.css';
import { SpeedDial, SpeedDialAction } from '@rubenchodev/materix-react/components/speed-dial';

export const title = { en: 'States', es: 'Estados' };
export const description = {
  en: 'Closed and open (the main icon rotates 45°). Hover or use Tab to see hover and focus; Escape closes it and returns focus to the FAB. An action with `disabled` is shown disabled and the arrow keys skip it.',
  es: 'Cerrado y abierto (el icono principal rota 45°). Pasa el puntero o usa Tab para ver hover y foco; Escape lo cierra y devuelve el foco al FAB. Una acción con `disabled` se muestra deshabilitada y las flechas la saltan.',
};

/** Esquina inferior derecha del panel (utilidades de posición). */
const corner = 'mtx-position-absolute mtx-right-0 mtx-bottom-0 mtx-m-2';

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">Closed</span>
        <div className="demo-panel demo-panel--tall">
          <SpeedDial ariaLabel="Closed actions" className={corner}>
            <SpeedDialAction icon="mail" tooltipTitle="Email" />
            <SpeedDialAction icon="event" tooltipTitle="Event" />
          </SpeedDial>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Open · with a disabled action</span>
        <div className="demo-panel demo-panel--tall">
          <SpeedDial ariaLabel="Open actions" defaultOpen className={corner}>
            <SpeedDialAction icon="mail" tooltipTitle="Email" />
            <SpeedDialAction icon="event" tooltipTitle="Event (unavailable)" disabled />
            <SpeedDialAction icon="note_add" tooltipTitle="Note" />
          </SpeedDial>
        </div>
      </div>
    </div>
  );
}
