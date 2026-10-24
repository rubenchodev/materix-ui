import '@rubenchodev/materix-ui/utilities.css';
import { SpeedDial, SpeedDialAction } from '@rubenchodev/materix-react/components/speed-dial';

export const title = { en: 'Open on hover', es: 'Abrir al pasar el puntero' };
export const description = {
  en: '`event="hover"` opens when the mouse enters and closes when it leaves; clicking still toggles it (touch and keyboard).',
  es: '`event="hover"` abre al entrar el ratón y cierra al salir; el clic sigue alternándolo (táctil y teclado).',
};

/** Esquina inferior derecha del panel (utilidades de posición). */
const corner = 'mtx-position-absolute mtx-right-0 mtx-bottom-0 mtx-m-2';

export default function Demo() {
  return (
    <div className="demo-panel demo-panel--tall">
      <SpeedDial ariaLabel="Quick actions" icon="menu" event="hover" className={corner}>
        <SpeedDialAction icon="print" tooltipTitle="Print" />
        <SpeedDialAction icon="download" tooltipTitle="Download" />
        <SpeedDialAction icon="share" tooltipTitle="Share" />
      </SpeedDial>
    </div>
  );
}
