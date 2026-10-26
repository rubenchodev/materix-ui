import { Tooltip } from '@rubenchodev/materix-react/components/tooltip';
import { Button } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'Advanced usage', es: 'Uso avanzado' };
export const description = {
  en: 'Equivalent of the vanilla `data-mtx="tooltip"` wrapper: a `<span>` wraps the trigger and several options are combined (`placement`, `arrow`, `enterDelay`, `leaveDelay`, `describeChild`). The generated surface is `.mtx-tooltip` with `role="tooltip"`, portaled to `<body>`.',
  es: 'Equivalente del envoltorio vanilla `data-mtx="tooltip"`: un `<span>` envuelve al disparador y se combinan varias opciones (`placement`, `arrow`, `enterDelay`, `leaveDelay`, `describeChild`). La superficie generada es `.mtx-tooltip` con `role="tooltip"`, portada a `<body>`.',
};

export default function Demo() {
  return (
    <div className="demo-row">
      <Tooltip title="Export to CSV" placement="right" arrow enterDelay={300} leaveDelay={200} describeChild>
        <span>
          <Button variant="outlined" startIcon="download">
            Export
          </Button>
        </span>
      </Tooltip>
    </div>
  );
}
