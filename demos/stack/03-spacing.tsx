import './demo.css';
import { Stack, type StackSpacing } from '@rubenchodev/materix-react/components/stack';

export const title = { en: 'Spacing', es: 'Espaciado' };

export const description = {
  en: 'Scale `0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10` (× 8px) applied with `gap`: no margins on the children.',
  es: 'Escala `0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10` (× 8px) aplicada con `gap`: sin márgenes en los hijos.',
};

const values: StackSpacing[] = [0.5, 1, 2, 4, 8];

export default function Demo() {
  return (
    <div className="demo-stack">
      {values.map((spacing) => (
        <div className="demo-group" key={spacing}>
          <span className="demo-label">
            spacing={'{'}
            {spacing}
            {'}'} · {Number(spacing) * 8}px
          </span>
          <Stack direction="row" spacing={spacing}>
            <div className="demo-stack-item">A</div>
            <div className="demo-stack-item">B</div>
            <div className="demo-stack-item">C</div>
          </Stack>
        </div>
      ))}
    </div>
  );
}
