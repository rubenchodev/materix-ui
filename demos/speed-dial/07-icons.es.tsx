import '@rubenchodev/materix-ui/utilities.css';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@rubenchodev/materix-react/components/speed-dial';

export const title = { en: 'Icons', es: 'Iconos' };
export const description = {
  en: 'Without `icon` the main FAB shows `<SpeedDialIcon />` (`add`, rotating 45°). `openIcon` swaps it for another icon while open, and an `<svg>` (24px) also works. The rotation respects `prefers-reduced-motion`.',
  es: 'Sin `icon` el FAB principal muestra `<SpeedDialIcon />` (`add`, que rota 45°). `openIcon` lo cambia por otro icono mientras está abierto, y también sirve un `<svg>` (24px). La rotación respeta `prefers-reduced-motion`.',
};

/** Esquina inferior derecha del panel (utilidades de posición). */
const corner = 'mtx-position-absolute mtx-right-0 mtx-bottom-0 mtx-m-2';

/** Icono SVG de lápiz (24px). */
function PencilSvg() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z" />
    </svg>
  );
}

export default function Demo() {
  return (
    <div className="demo-grid-3">
      <div className="demo-group">
        <span className="demo-label">Por defecto · rota 45°</span>
        <div className="demo-panel demo-panel--tall">
          <SpeedDial ariaLabel="Icono por defecto" className={corner}>
            <SpeedDialAction icon="mail" tooltipTitle="Correo" />
            <SpeedDialAction icon="event" tooltipTitle="Evento" />
          </SpeedDial>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">SpeedDialIcon + openIcon SVG</span>
        <div className="demo-panel demo-panel--tall">
          <SpeedDial ariaLabel="Acciones de edición" icon={<SpeedDialIcon openIcon={<PencilSvg />} />} className={corner}>
            <SpeedDialAction icon="content_copy" tooltipTitle="Copiar" />
            <SpeedDialAction icon="share" tooltipTitle="Compartir" />
          </SpeedDial>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">icon + openIcon</span>
        <div className="demo-panel demo-panel--tall">
          <SpeedDial ariaLabel="Mensajes" icon="chat" openIcon="close" className={corner}>
            <SpeedDialAction icon="mail" tooltipTitle="Correo" />
            <SpeedDialAction icon="sms" tooltipTitle="SMS" />
          </SpeedDial>
        </div>
      </div>
    </div>
  );
}
