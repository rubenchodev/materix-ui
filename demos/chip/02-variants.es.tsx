import { Chip } from '@rubenchodev/materix-react/components/chip';

export const title = { en: 'Variants', es: 'Variantes' };
export const description = {
  en: '`filled` (default) uses a solid background; `outlined` uses a border and a transparent background.',
  es: '`filled` (por defecto) usa fondo sólido; `outlined` usa borde y fondo transparente.',
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">Filled</span>
        <div className="demo-row">
          <Chip label="Relleno" />
          <Chip label="Clicable" onClick={() => {}} />
          <Chip label="Eliminable" onDelete={() => {}} />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Outlined</span>
        <div className="demo-row">
          <Chip label="Con borde" variant="outlined" />
          <Chip label="Clicable" variant="outlined" onClick={() => {}} />
          <Chip label="Eliminable" variant="outlined" onDelete={() => {}} />
        </div>
      </div>
    </div>
  );
}
