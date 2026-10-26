import './demo.css';
import { Stack } from '@rubenchodev/materix-react/components/stack';

export const title = { en: 'Basic usage', es: 'Uso básico' };

export const description = {
  en: 'A single `<Stack>`. As in MUI, the default direction is column; `spacing` sets the gap in multiples of 8px.',
  es: 'Un único `<Stack>`. Como en MUI, la dirección por defecto es columna; `spacing` fija la separación en múltiplos de 8px.',
};

export default function Demo() {
  return (
    <Stack spacing={2}>
      <div className="demo-stack-item">Elemento 1</div>
      <div className="demo-stack-item">Elemento 2</div>
      <div className="demo-stack-item">Elemento 3</div>
    </Stack>
  );
}
