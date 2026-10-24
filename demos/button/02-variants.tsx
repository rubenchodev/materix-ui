import { Button } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'Variants', es: 'Variantes' };
export const description = {
  en: "Visual hierarchy is expressed with the variant: `contained` for the primary action, `outlined` for medium-emphasis secondary actions and `text` for low-emphasis actions (dialogs, cards).",
  es: "La jerarquía visual se expresa con la variante: `contained` para la acción principal, `outlined` para acciones secundarias de énfasis medio y `text` para acciones de énfasis bajo (diálogos, tarjetas).",
};

export default function Demo() {
  return (
    <div className="demo-grid-3">
      <div className="demo-group">
        <span className="demo-label">Contained · high emphasis</span>
        <div className="demo-row">
          <Button variant="contained">Contained</Button>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Outlined · medium emphasis</span>
        <div className="demo-row">
          <Button variant="outlined">Outlined</Button>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Text · low emphasis</span>
        <div className="demo-row">
          <Button variant="text">Text</Button>
        </div>
      </div>
    </div>
  );
}
