import { Checkbox } from '@rubenchodev/materix-react/components/checkbox';

export const title = { en: 'With and without label', es: 'Con y sin etiqueta' };
export const description = {
  en: "Without label only the box is drawn; in that case add aria-label (or aria-labelledby) so the control has an accessible name, as in table rows.",
  es: "Sin label solo se dibuja la caja; en ese caso añade aria-label (o aria-labelledby) para que el control tenga nombre accesible, como en las filas de una tabla.",
};

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">With visible label</span>
        <div className="demo-row">
          <Checkbox label="Send a copy to my email" defaultChecked />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Box only · aria-label</span>
        <div className="demo-row">
          <Checkbox aria-label="Select row 1" defaultChecked />
          <Checkbox aria-label="Select row 2" />
          <Checkbox aria-label="Select row 3" size="small" />
        </div>
      </div>
    </div>
  );
}
