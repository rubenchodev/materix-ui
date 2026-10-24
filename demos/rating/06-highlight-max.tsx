import { Rating } from '@rubenchodev/materix-react/components/rating';

export const title = { en: 'Highlight selected only and max', es: 'Solo el seleccionado y máximo' };
export const description = {
  en: "`highlightSelectedOnly` highlights only the chosen icon, useful for satisfaction scales, and `max` changes the number of icons (5 by default).",
  es: "`highlightSelectedOnly` resalta solo el icono elegido, útil en escalas de satisfacción, y `max` cambia el número de iconos (5 por defecto).",
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">highlightSelectedOnly</span>
        <Rating
          defaultValue={3}
          highlightSelectedOnly
          icon="circle"
          emptyIcon="radio_button_unchecked"
          aria-label="Satisfaction"
        />
      </div>
      <div className="demo-group">
        <span className="demo-label">max = 10</span>
        <Rating defaultValue={7} max={10} size="small" aria-label="Score out of 10" />
      </div>
    </div>
  );
}
