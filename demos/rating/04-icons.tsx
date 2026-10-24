import type { CSSProperties } from 'react';
import { Rating } from '@rubenchodev/materix-react/components/rating';

export const title = { en: 'Icons', es: 'Iconos' };
export const description = {
  en: "`icon` and `emptyIcon` accept a Material Icons name or a React node. Built-in names are drawn as SVG; other glyphs keep their native 24px. Change the color with `--mtx-rating-color`.",
  es: "`icon` y `emptyIcon` aceptan un nombre de Material Icons o un nodo de React. Los nombres incluidos se dibujan en SVG; el resto de glifos conserva sus 24px nativos. Cambia el color con `--mtx-rating-color`.",
};

const ERROR_COLOR = { '--mtx-rating-color': 'var(--mtx-color-error)' } as CSSProperties;

/** Icono SVG propio pasado como nodo: escala con `--mtx-rating-icon-size`. */
const Bolt = (
  <svg viewBox="0 0 24 24" focusable="false">
    <path d="M7 2v11h3v9l7-12h-4l4-8z" />
  </svg>
);

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">icon="favorite" + emptyIcon="favorite_border"</span>
        <Rating defaultValue={3} precision={0.5} icon="favorite" emptyIcon="favorite_border" style={ERROR_COLOR} aria-label="Likes" />
      </div>
      <div className="demo-group">
        <span className="demo-label">emptyIcon="star" (gray stars)</span>
        <Rating defaultValue={2} emptyIcon="star" aria-label="Gray stars" />
      </div>
      <div className="demo-group">
        <span className="demo-label">icon="thumb_up" + emptyIcon="thumb_up_off_alt"</span>
        <Rating defaultValue={3} icon="thumb_up" emptyIcon="thumb_up_off_alt" aria-label="Approval" />
      </div>
      <div className="demo-group">
        <span className="demo-label">Material Icons glyph (native 24px)</span>
        <Rating defaultValue={2} icon="sentiment_satisfied" aria-label="Mood" />
      </div>
      <div className="demo-group">
        <span className="demo-label">Custom SVG node</span>
        <Rating defaultValue={4} size="large" icon={Bolt} aria-label="Energy" />
      </div>
    </div>
  );
}
