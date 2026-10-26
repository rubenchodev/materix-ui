import { Tooltip } from '@rubenchodev/materix-react/components/tooltip';
import { Button } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'Long text', es: 'Texto largo' };
export const description = {
  en: 'The maximum width is 300 px (`--mtx-tooltip-max-width`) and the text wraps onto several lines.',
  es: 'El ancho máximo es de 300 px (`--mtx-tooltip-max-width`) y el texto se reparte en varias líneas.',
};

export default function Demo() {
  return (
    <div className="demo-row">
      <Tooltip title="Las facturas emitidas se archivan automáticamente al cerrar el ejercicio fiscal y pueden consultarse en Informes → Historial durante diez años.">
        <Button variant="outlined">Ancho por defecto</Button>
      </Tooltip>
    </div>
  );
}
