import { Tooltip } from '@rubenchodev/materix-react/components/tooltip';
import { Button } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'Delays', es: 'Retardos' };
export const description = {
  en: 'It appears after 100 ms (`enterDelay`) and hides on leave (`leaveDelay`). After one closes, the next one opens with `enterNextDelay` (0 ms) for 800 ms, ideal for toolbars.',
  es: 'Aparece a los 100 ms (`enterDelay`) y se oculta al salir (`leaveDelay`). Tras cerrarse uno, el siguiente abre con `enterNextDelay` (0 ms) durante 800 ms, ideal para barras de herramientas.',
};

export default function Demo() {
  return (
    <div className="demo-row">
      <Tooltip title="Aparece a los 100 ms">
        <Button variant="outlined">Por defecto</Button>
      </Tooltip>
      <Tooltip title="Aparece a los 500 ms" enterDelay={500}>
        <Button variant="outlined">enter 500 ms</Button>
      </Tooltip>
      <Tooltip title="Permanece 1 s después de salir" leaveDelay={1000}>
        <Button variant="outlined">leave 1000 ms</Button>
      </Tooltip>
      <Tooltip title="Espera 500 ms incluso justo después de otro" enterDelay={500} enterNextDelay={500}>
        <Button variant="outlined">enterNextDelay 500 ms</Button>
      </Tooltip>
    </div>
  );
}
