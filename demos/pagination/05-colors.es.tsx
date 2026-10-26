import { Pagination } from '@rubenchodev/materix-react/components/pagination';

export const title = { en: 'Colors', es: 'Colores' };
export const description = {
  en: "`color` sets the selected page color: `standard` (neutral, default), `primary` or `secondary`.",
  es: "`color` fija el color de la página seleccionada: `standard` (neutro, por defecto), `primary` o `secondary`.",
};

const COLORS = ['standard', 'primary', 'secondary'] as const;

export default function Demo() {
  return (
    <div className="demo-stack">
      {COLORS.map((color) => (
        <div className="demo-group" key={color}>
          <span className="demo-label">{color}</span>
          <Pagination count={6} defaultPage={3} color={color} aria-label={`Color ${color}`} />
        </div>
      ))}
    </div>
  );
}
