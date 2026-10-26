import type { CSSProperties } from 'react';
import { Accordion } from '@rubenchodev/materix-react/components/accordion';

export const title = { en: 'With icons', es: 'Con iconos' };
export const description = {
  en: '`expandIcon` accepts a Material Icons name or a node (SVG) and `false` omits it; it rotates 180° (`--mtx-accordion-expand-icon-rotation`). `summary` also accepts nodes, such as a leading icon.',
  es: '`expandIcon` acepta un nombre de Material Icons o un nodo (SVG) y `false` lo omite; gira 180° (`--mtx-accordion-expand-icon-rotation`). `summary` también admite nodos, como un icono inicial.',
};

export default function Demo() {
  return (
    <div className="demo-wide">
      <Accordion summary="expand_more (predeterminado)">Contenido.</Accordion>
      <Accordion expandIcon="arrow_drop_down" summary="arrow_drop_down">
        Contenido.
      </Accordion>
      <Accordion
        expandIcon="add"
        summary="add girando 45°"
        style={{ '--mtx-accordion-expand-icon-rotation': '45deg' } as CSSProperties}
      >
        Contenido.
      </Accordion>
      <Accordion
        expandIcon={
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
          </svg>
        }
        summary="Icono SVG personalizado"
      >
        Contenido.
      </Accordion>
      <Accordion
        summary={
          <>
            <span className="material-icons" aria-hidden="true">
              settings
            </span>
            Icono inicial en el resumen
          </>
        }
      >
        Contenido.
      </Accordion>
      <Accordion expandIcon={false} summary="Sin icono">
        Contenido.
      </Accordion>
    </div>
  );
}
