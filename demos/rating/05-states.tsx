import { Rating } from '@rubenchodev/materix-react/components/rating';

export const title = { en: 'States', es: 'Estados' };
export const description = {
  en: "Hover for the preview (the active star grows 1.2×), and use <kbd>Tab</kbd> and the arrow keys to change the value with a visible focus ring. `readOnly` shows a fixed rating and `disabled` dims it.",
  es: "Pasa el cursor para la vista previa (la estrella activa crece 1,2×) y usa <kbd>Tab</kbd> y las flechas para cambiar el valor con un anillo de foco visible. `readOnly` muestra una valoración fija y `disabled` la atenúa.",
};

export default function Demo() {
  return (
    <div className="demo-grid-4">
      <div className="demo-group">
        <span className="demo-label">Interactive</span>
        <Rating defaultValue={2} aria-label="Interactive" />
      </div>
      <div className="demo-group">
        <span className="demo-label">Read-only</span>
        <Rating value={3.5} precision={0.5} readOnly />
      </div>
      <div className="demo-group">
        <span className="demo-label">Disabled</span>
        <Rating defaultValue={2} disabled aria-label="Disabled" />
      </div>
      <div className="demo-group">
        <span className="demo-label">No value</span>
        <Rating aria-label="No value" />
      </div>
    </div>
  );
}
