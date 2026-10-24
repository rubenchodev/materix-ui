import '@rubenchodev/materix-ui/utilities.css';
import { SpeedDial, SpeedDialAction } from '@rubenchodev/materix-react/components/speed-dial';

export const title = { en: 'Labels', es: 'Etiquetas' };
export const description = {
  en: 'By default every label is visible while open (`tooltipOpen`, with the Tooltip tokens). With `tooltipHover` each action uses a real Tooltip: it appears on hover and on keyboard focus, and Escape hides it. `tooltipOpen` and `tooltipPlacement` on an action override this for that action.',
  es: 'Por defecto todas las etiquetas se ven mientras está abierto (`tooltipOpen`, con los tokens del Tooltip). Con `tooltipHover` cada acción usa un Tooltip real: aparece al pasar el puntero y al enfocar con el teclado, y Escape lo oculta. `tooltipOpen` y `tooltipPlacement` en una acción lo cambian para esa acción.',
};

/** Esquina inferior derecha del panel (utilidades de posición). */
const corner = 'mtx-position-absolute mtx-right-0 mtx-bottom-0 mtx-m-2';

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">Always visible</span>
        <div className="demo-panel demo-panel--tall">
          <SpeedDial ariaLabel="Visible labels" defaultOpen className={corner}>
            <SpeedDialAction icon="photo_camera" tooltipTitle="Take photo" />
            <SpeedDialAction icon="upload" tooltipTitle="Upload file" />
          </SpeedDial>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">tooltipHover</span>
        <div className="demo-panel demo-panel--tall">
          <SpeedDial ariaLabel="Labels on hover" tooltipHover defaultOpen className={corner}>
            <SpeedDialAction icon="photo_camera" tooltipTitle="Take photo" />
            <SpeedDialAction icon="upload" tooltipTitle="Upload file" tooltipPlacement="top" />
          </SpeedDial>
        </div>
      </div>
    </div>
  );
}
