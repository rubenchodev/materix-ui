import { useRef } from 'react';
import type { CSSProperties } from 'react';
import { AppBar } from '@rubenchodev/materix-react/components/app-bar';

export const title = { en: 'Scroll', es: 'Scroll' };
export const description = {
  en: '`elevateOnScroll` starts without a shadow and adds it on scroll; `hideOnScroll` hides the bar when scrolling down (past 50px) and shows it when scrolling up. `scrollTarget` sets the observed container (a ref here; the window by default). Scroll each box.',
  es: '`elevateOnScroll` empieza sin sombra y la añade al desplazarse; `hideOnScroll` oculta la barra al bajar (más de 50px) y la muestra al subir. `scrollTarget` fija el contenedor observado (aquí una ref; por defecto la ventana). Desplaza cada caja.',
};

const paragraphs = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
];

const frame: CSSProperties = { height: 280 };
const FRAME = 'mtx-position-relative mtx-overflow-y-auto mtx-border mtx-rounded mtx-bg-default';

/** Párrafos de relleno. */
function Body({ intro }: { intro: string }) {
  return (
    <div className="mtx-p-2 mtx-typography--body2">
      {[intro, ...paragraphs].map((text) => (
        <p key={text} className="mtx-mt-0 mtx-mb-2">
          {text}
        </p>
      ))}
    </div>
  );
}

export default function Demo() {
  const elevateRef = useRef<HTMLDivElement>(null);
  const hideRef = useRef<HTMLDivElement>(null);
  return (
    <div className="demo-grid-2 mtx-w-100">
      <div className="demo-group">
        <p className="demo-label">Elevar al desplazar</p>
        <div ref={elevateRef} className={FRAME} style={frame} tabIndex={0} role="region" aria-label="Demo de elevación al desplazar">
          <AppBar position="sticky" color="default" elevateOnScroll scrollTarget={elevateRef} title="Se eleva al desplazar" startIcon="menu" />
          <Body intro="Arriba del todo la barra es plana. Al desplazarte recibe elevación 4." />
        </div>
      </div>
      <div className="demo-group">
        <p className="demo-label">Ocultar al desplazar</p>
        <div ref={hideRef} className={FRAME} style={frame} tabIndex={0} role="region" aria-label="Demo de ocultar al desplazar">
          <AppBar position="sticky" color="primary" hideOnScroll scrollTarget={hideRef} title="Se oculta al bajar" startIcon="menu" />
          <Body intro="Baja para ocultar la barra; sube para que reaparezca." />
        </div>
      </div>
    </div>
  );
}
