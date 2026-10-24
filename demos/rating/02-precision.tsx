import { Rating } from '@rubenchodev/materix-react/components/rating';

export const title = { en: 'Precision', es: 'Precisión' };
export const description = {
  en: "`precision={0.5}` allows half stars: each star contains two radios and its left half picks the x.5 value. Fractions such as `0.25` also work.",
  es: "`precision={0.5}` permite medias estrellas: cada estrella contiene dos radios y su mitad izquierda elige el valor x.5. También sirven fracciones como `0.25`.",
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">precision = 1 (default)</span>
        <Rating defaultValue={4} aria-label="Whole-star precision" />
      </div>
      <div className="demo-group">
        <span className="demo-label">precision = 0.5</span>
        <Rating defaultValue={2.5} precision={0.5} aria-label="Half-star precision" />
      </div>
      <div className="demo-group">
        <span className="demo-label">precision = 0.25</span>
        <Rating defaultValue={3.75} precision={0.25} aria-label="Quarter-star precision" />
      </div>
    </div>
  );
}
