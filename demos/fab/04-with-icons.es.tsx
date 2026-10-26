import { Fab } from '@rubenchodev/materix-react/components/fab';

export const title = { en: 'With icons', es: 'Con iconos' };
export const description = {
  en: 'Combine `icon` and `label` depending on what you need to communicate. A string icon is always decorative (`aria-hidden="true"`); `icon` also accepts a node such as an SVG.',
  es: 'Combina `icon` y `label` según lo que necesites comunicar. Un icono string siempre es decorativo (`aria-hidden="true"`); `icon` también acepta un nodo, como un SVG.',
};

export default function Demo() {
  return (
    <div className="demo-grid-3">
      <div className="demo-group">
        <span className="demo-label">Solo icono</span>
        <div className="demo-row">
          <Fab icon="favorite" aria-label="Me gusta" />
          <Fab
            aria-label="Subir"
            icon={
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
              </svg>
            }
          />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Icono y texto</span>
        <div className="demo-row">
          <Fab icon="shopping_cart" label="Comprar" />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Solo texto</span>
        <div className="demo-row">
          <Fab label="Continuar" />
        </div>
      </div>
    </div>
  );
}
