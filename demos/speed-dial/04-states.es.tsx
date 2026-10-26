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
        <span className="demo-label">Cerrado</span>
        <div className="demo-panel demo-panel--tall">
          <SpeedDial ariaLabel="Acciones cerradas" className={corner}>
            <SpeedDialAction icon="mail" tooltipTitle="Correo" />
            <SpeedDialAction icon="event" tooltipTitle="Evento" />
          </SpeedDial>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Abierto · con una acción deshabilitada</span>
        <div className="demo-panel demo-panel--tall">
          <SpeedDial ariaLabel="Acciones abiertas" defaultOpen className={corner}>
            <SpeedDialAction icon="mail" tooltipTitle="Correo" />
            <SpeedDialAction icon="event" tooltipTitle="Evento (no disponible)" disabled />
            <SpeedDialAction icon="note_add" tooltipTitle="Nota" />
          </SpeedDial>
        </div>
      </div>
    </div>
  );
}
