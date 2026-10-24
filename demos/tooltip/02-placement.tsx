import { Tooltip } from '@rubenchodev/materix-react/components/tooltip';
import type { TooltipProps } from '@rubenchodev/materix-react/components/tooltip';
import { Button } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'Placement', es: 'Posición' };
export const description = {
  en: '`placement` accepts 12 positions (`top|bottom|left|right` with `-start|-end`); the default is `bottom`. If it doesn\'t fit, it flips to the opposite side and shifts to stay on screen.',
  es: '`placement` admite 12 posiciones (`top|bottom|left|right` con `-start|-end`); por defecto `bottom`. Si no cabe, voltea al lado opuesto y se desplaza para seguir en pantalla.',
};

type Placement = NonNullable<TooltipProps['placement']>;

const GROUPS: Array<{ label: string; placements: Placement[] }> = [
  { label: 'Top', placements: ['top-start', 'top', 'top-end'] },
  { label: 'Bottom', placements: ['bottom-start', 'bottom', 'bottom-end'] },
  { label: 'Left and right', placements: ['left-start', 'left', 'left-end', 'right-start', 'right', 'right-end'] },
];

export default function Demo() {
  return (
    <div className="demo-grid-3">
      {GROUPS.map(({ label, placements }) => (
        <div className="demo-group" key={label}>
          <span className="demo-label">{label}</span>
          <div className="demo-row">
            {placements.map((placement) => (
              <Tooltip key={placement} title={placement} placement={placement}>
                <Button variant="outlined">{placement}</Button>
              </Tooltip>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
