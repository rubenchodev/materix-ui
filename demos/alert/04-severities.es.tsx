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
        success — la operación se completó correctamente.
      </Alert>
      <Alert severity="info" variant="filled">
        info — información neutra o contextual.
      </Alert>
      <Alert severity="warning" variant="filled">
        warning — algo requiere atención pronto.
      </Alert>
      <Alert severity="error" variant="filled">
        error — la operación falló y se requiere una acción.
      </Alert>
    </div>
  );
}
