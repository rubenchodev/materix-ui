import './demo.css';
import { Stack, type StackDirection } from '@rubenchodev/materix-react/components/stack';

export const title = { en: 'Direction', es: 'Dirección' };

export const description = {
  en: '`direction`: `column` (default), `row`, `column-reverse` or `row-reverse`. Reading and tab order still follow the JSX.',
  es: '`direction`: `column` (por defecto), `row`, `column-reverse` o `row-reverse`. El orden de lectura y de tabulación sigue al JSX.',
};

const directions: StackDirection[] = ['row', 'row-reverse', 'column', 'column-reverse'];

export default function Demo() {
  return (
    <div className="demo-grid-2">
      {directions.map((direction) => (
        <div className="demo-group" key={direction}>
          <span className="demo-label">direction=&quot;{direction}&quot;</span>
          <Stack direction={direction} spacing={1}>
            <div className="demo-stack-item">1</div>
            <div className="demo-stack-item">2</div>
            <div className="demo-stack-item">3</div>
          </Stack>
        </div>
      ))}
    </div>
  );
}
