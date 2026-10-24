export const title = { en: 'Manual BEM markup', es: 'Marcado BEM manual' };
export const description = {
  en: 'The CSS also works with plain markup (static HTML, server templates): base class, modifiers and content (icon and label) written by hand. You lose the ripple, so prefer the component.',
  es: 'El CSS también funciona con marcado plano (HTML estático, plantillas de servidor): clase base, modificadores y contenido (icono y texto) escritos a mano. Se pierde el ripple, así que es preferible el componente.',
};

export default function Demo() {
  return (
    <div className="demo-row">
      <button type="button" className="mtx-fab mtx-fab--secondary" aria-label="Edit">
        <span className="material-icons" aria-hidden="true">
          edit
        </span>
      </button>
      <button type="button" className="mtx-fab mtx-fab--extended">
        <span className="material-icons" aria-hidden="true">
          add
        </span>
        <span>New ticket</span>
      </button>
      <button type="button" className="mtx-fab mtx-fab--small" aria-label="Add">
        <span className="material-icons" aria-hidden="true">
          add
        </span>
      </button>
    </div>
  );
}
