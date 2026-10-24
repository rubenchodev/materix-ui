import { Alert } from '@rubenchodev/materix-react/components/alert';

export const title = { en: 'Severities', es: 'Severidades' };
export const description = {
  en: '`severity` sets the color and the icon; without it, `success` is applied.',
  es: '`severity` fija el color y el icono; sin la prop se aplica `success`.',
};

export default function Demo() {
  return (
    <div className="demo-stack demo-wide">
      <Alert severity="success" variant="filled">
        success — the operation completed successfully.
      </Alert>
      <Alert severity="info" variant="filled">
        info — neutral or contextual information.
      </Alert>
      <Alert severity="warning" variant="filled">
        warning — something needs attention soon.
      </Alert>
      <Alert severity="error" variant="filled">
        error — the operation failed and action is required.
      </Alert>
    </div>
  );
}
