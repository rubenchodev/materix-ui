import '@rubenchodev/materix-ui/utilities.css';
import { useState } from 'react';
import { SpeedDial, SpeedDialAction } from '@rubenchodev/materix-react/components/speed-dial';

export const title = { en: 'Real-world examples', es: 'Ejemplos reales' };
export const description = {
  en: 'Photo gallery: the SpeedDial is controlled, so each action runs its task and closes it. On a real page you would use `position="fixed-br"` to pin it to the viewport.',
  es: 'Galería de fotos: el SpeedDial es controlado, así que cada acción hace su tarea y lo cierra. En una página real usarías `position="fixed-br"` para fijarlo a la ventana.',
};

/** Esquina inferior derecha del panel (utilidades de posición). */
const corner = 'mtx-position-absolute mtx-right-0 mtx-bottom-0 mtx-m-2';
const actions = [
  ['photo_camera', 'Hacer foto'],
  ['upload', 'Subir archivo'],
  ['create_new_folder', 'Nuevo álbum'],
] as const;

export default function Demo() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('Elige una acción.');

  return (
    <div className="demo-panel demo-panel--tall">
      <p className="demo-status mtx-m-2" aria-live="polite">
        {status}
      </p>
      <SpeedDial
        ariaLabel="Añadir a la galería"
        icon="add_a_photo"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        className={corner}
      >
        {actions.map(([icon, label]) => (
          <SpeedDialAction
            key={icon}
            icon={icon}
            tooltipTitle={label}
            onClick={() => {
              setStatus(`Acción: ${label}`);
              setOpen(false);
            }}
          />
        ))}
      </SpeedDial>
    </div>
  );
}
