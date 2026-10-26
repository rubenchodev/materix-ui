import './demo.css';
import { Container, type ContainerMaxWidth } from '@rubenchodev/materix-react/components/container';

export const title = { en: 'Max width', es: 'Ancho máximo' };

export const description = {
  en: '`maxWidth` sets the cap: `xs` 444px, `sm` 600px, `md` 900px, `lg` 1200px, `xl` 1536px or `false` to take the full width.',
  es: '`maxWidth` fija el tope: `xs` 444px, `sm` 600px, `md` 900px, `lg` 1200px, `xl` 1536px o `false` para ocupar todo el ancho.',
};

const options: Array<{ value: ContainerMaxWidth; label: string }> = [
  { value: 'xs', label: 'maxWidth="xs" · 444px' },
  { value: 'sm', label: 'maxWidth="sm" · 600px' },
  { value: 'md', label: 'maxWidth="md" · 900px' },
  { value: 'lg', label: 'maxWidth="lg" · 1200px (predeterminado)' },
  { value: false, label: 'maxWidth={false} · fluido' },
];

export default function Demo() {
  return (
    <div className="demo-stack">
      {options.map(({ value, label }) => (
        <div className="demo-group" key={String(value)}>
          <span className="demo-label">{label}</span>
          <div className="demo-container-frame">
            <Container maxWidth={value}>
              <div className="demo-container-box">{String(value)}</div>
            </Container>
          </div>
        </div>
      ))}
    </div>
  );
}
