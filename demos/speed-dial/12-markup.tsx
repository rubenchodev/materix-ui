import '@rubenchodev/materix-ui/utilities.css';
import '@rubenchodev/materix-ui/components/fab.css';
import '@rubenchodev/materix-ui/components/speed-dial.css';

export const title = { en: 'Manual BEM markup', es: 'Marcado BEM manual' };
export const description = {
  en: 'The CSS also works with plain markup (static HTML, server templates). Here it is shown open with `mtx-speed-dial--open`; without the component you manage the state, `aria-expanded`, `inert` and the keyboard yourself, so prefer the component.',
  es: 'El CSS también funciona con marcado plano (HTML estático, plantillas de servidor). Aquí se muestra abierto con `mtx-speed-dial--open`; sin el componente tú gestionas el estado, `aria-expanded`, `inert` y el teclado, así que es preferible el componente.',
};

/** Esquina inferior derecha del panel (utilidades de posición). */
const corner = 'mtx-position-absolute mtx-right-0 mtx-bottom-0 mtx-m-2';

export default function Demo() {
  return (
    <div className="demo-panel demo-panel--tall">
      <div className={`mtx-speed-dial mtx-speed-dial--direction-up mtx-speed-dial--open ${corner}`}>
        <button
          type="button"
          className="mtx-fab mtx-fab--primary mtx-speed-dial__fab"
          aria-label="Create"
          aria-haspopup="true"
          aria-expanded="true"
          aria-controls="markup-speed-dial-actions"
        >
          <span className="material-icons" aria-hidden="true">
            add
          </span>
        </button>
        <div className="mtx-speed-dial__actions" id="markup-speed-dial-actions">
          <div className="mtx-speed-dial__action-wrapper">
            <span className="mtx-speed-dial__tooltip" aria-hidden="true">
              Document
            </span>
            <button
              type="button"
              className="mtx-fab mtx-fab--small mtx-fab--secondary mtx-speed-dial__action"
              aria-label="Document"
            >
              <span className="material-icons" aria-hidden="true">
                description
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
