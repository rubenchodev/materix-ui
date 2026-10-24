import '@rubenchodev/materix-ui/utilities.css';
import { SpeedDial, SpeedDialAction } from '@rubenchodev/materix-react/components/speed-dial';

export const title = { en: 'Colors', es: 'Colores' };
export const description = {
  en: '`color` on the SpeedDial colors the main FAB (`primary` by default); on each `SpeedDialAction`, it colors that action (`secondary` by default).',
  es: '`color` en el SpeedDial colorea el FAB principal (`primary` por defecto); en cada `SpeedDialAction`, colorea esa acción (`secondary` por defecto).',
};

/** Esquina inferior derecha del panel (utilidades de posición). */
const corner = 'mtx-position-absolute mtx-right-0 mtx-bottom-0 mtx-m-2';

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">Defaults · primary + secondary</span>
        <div className="demo-panel demo-panel--tall">
          <SpeedDial ariaLabel="Create" defaultOpen className={corner}>
            <SpeedDialAction icon="mail" tooltipTitle="Email" />
            <SpeedDialAction icon="event" tooltipTitle="Event" />
          </SpeedDial>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">secondary + error · success · info</span>
        <div className="demo-panel demo-panel--tall">
          <SpeedDial ariaLabel="Edit" icon="edit" color="secondary" defaultOpen className={corner}>
            <SpeedDialAction icon="delete" color="error" tooltipTitle="Delete" />
            <SpeedDialAction icon="save" color="success" tooltipTitle="Save" />
            <SpeedDialAction icon="info" color="info" tooltipTitle="Details" />
          </SpeedDial>
        </div>
      </div>
    </div>
  );
}
