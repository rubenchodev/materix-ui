import '@rubenchodev/materix-ui/utilities.css';
import { SpeedDial, SpeedDialAction } from '@rubenchodev/materix-react/components/speed-dial';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: '`ariaLabel` names the main FAB and each `SpeedDialAction` takes an `icon` and a `tooltipTitle` (its visible label and, if missing, its `aria-label`). Press the FAB. The actions take up space even when hidden: place the SpeedDial in a corner with absolute or fixed positioning.',
  es: '`ariaLabel` nombra el FAB principal y cada `SpeedDialAction` recibe `icon` y `tooltipTitle` (su etiqueta visible y, si falta, su `aria-label`). Pulsa el FAB. Las acciones ocupan espacio aunque estén ocultas: coloca el SpeedDial en una esquina con posición absoluta o fija.',
};

/** Esquina inferior derecha del panel (utilidades de posición). */
const corner = 'mtx-position-absolute mtx-right-0 mtx-bottom-0 mtx-m-2';

export default function Demo() {
  return (
    <div className="demo-panel demo-panel--tall">
      <SpeedDial ariaLabel="Create" className={corner}>
        <SpeedDialAction icon="description" tooltipTitle="Document" />
        <SpeedDialAction icon="table_chart" tooltipTitle="Spreadsheet" />
        <SpeedDialAction icon="slideshow" tooltipTitle="Presentation" />
      </SpeedDial>
    </div>
  );
}
