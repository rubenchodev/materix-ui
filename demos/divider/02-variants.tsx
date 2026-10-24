import { Divider } from '@rubenchodev/materix-react/components/divider';

export const title = { en: 'Variants', es: 'Variantes' };
export const description = {
  en: 'Without `variant` it spans the full width; `middle` leaves 16px on each side; `inset` leaves 72px on the left to align with the text of lists with icons.',
  es: 'Sin `variant` ocupa todo el ancho; `middle` deja 16px a cada lado; `inset` deja 72px a la izquierda para alinearse con el texto de las listas con icono.',
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">Full width</span>
        <Divider />
      </div>
      <div className="demo-group">
        <span className="demo-label">Middle · 16px on each side</span>
        <Divider variant="middle" />
      </div>
      <div className="demo-group">
        <span className="demo-label">Inset · 72px on the left</span>
        <Divider variant="inset" />
      </div>
    </div>
  );
}
