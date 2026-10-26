import '@rubenchodev/materix-ui/utilities.css';
import { SpeedDial, SpeedDialAction } from '@rubenchodev/materix-react/components/speed-dial';
import type { SpeedDialDirection } from '@rubenchodev/materix-react/components/speed-dial';

export const title = { en: 'Directions', es: 'Direcciones' };
export const description = {
  en: '`direction="up|down|left|right"`. Arrow keys follow the direction: the one pointing away from the FAB moves through the actions and the opposite one returns. For horizontal directions `tooltipHover` is recommended so the labels do not overlap.',
  es: '`direction="up|down|left|right"`. Las flechas siguen la dirección: la que se aleja del FAB recorre las acciones y la opuesta vuelve. En direcciones horizontales se recomienda `tooltipHover` para que las etiquetas no se solapen.',
};

const items: Array<{ direction: SpeedDialDirection; icon: string; label: string; note: string; place: string }> = [
  { direction: 'up', icon: 'north', label: 'Hacia arriba', note: 'up · por defecto', place: 'mtx-position-absolute mtx-right-0 mtx-bottom-0 mtx-m-2' },
  { direction: 'down', icon: 'south', label: 'Hacia abajo', note: 'down', place: 'mtx-position-absolute mtx-right-0 mtx-top-0 mtx-m-2' },
  {
    direction: 'left',
    icon: 'west',
    label: 'Hacia la izquierda',
    note: 'left · tooltipHover',
    place: 'mtx-position-absolute mtx-top-0 mtx-bottom-0 mtx-right-0 mtx-m-2',
  },
  {
    direction: 'right',
    icon: 'east',
    label: 'Hacia la derecha',
    note: 'right · tooltipHover',
    place: 'mtx-position-absolute mtx-top-0 mtx-bottom-0 mtx-left-0 mtx-m-2',
  },
];

export default function Demo() {
  return (
    <div className="demo-grid-2">
      {items.map(({ direction, icon, label, note, place }) => (
        <div key={direction} className="demo-group">
          <span className="demo-label">{note}</span>
          <div className="demo-panel demo-panel--tall">
            <SpeedDial
              ariaLabel={label}
              icon={icon}
              direction={direction}
              tooltipHover={direction === 'left' || direction === 'right'}
              className={place}
            >
              <SpeedDialAction icon="content_copy" tooltipTitle="Copiar" />
              <SpeedDialAction icon="share" tooltipTitle="Compartir" />
              <SpeedDialAction icon="print" tooltipTitle="Imprimir" />
            </SpeedDial>
          </div>
        </div>
      ))}
    </div>
  );
}
