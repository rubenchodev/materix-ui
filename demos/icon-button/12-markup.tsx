export const title = { en: 'Manual BEM markup', es: 'Marcado BEM manual' };
export const description = {
  en: 'The CSS also works with plain markup (static HTML, server templates): base class, size and color modifiers and the nested icon. You lose the ripple, so prefer the component.',
  es: 'El CSS también funciona con marcado plano (HTML estático, plantillas de servidor): clase base, modificadores de tamaño y color e icono anidado. Se pierde el ripple, así que es preferible el componente.',
};

export default function Demo() {
  return (
    <div className="demo-row">
      <button type="button" className="mtx-icon-button mtx-icon-button--large mtx-icon-button--primary" aria-label="Edit (large)">
        <span className="material-icons" aria-hidden="true">
          edit
        </span>
      </button>
      <button type="button" className="mtx-icon-button" aria-label="Edit">
        <span className="material-icons" aria-hidden="true">
          edit
        </span>
      </button>
      <button type="button" className="mtx-icon-button mtx-icon-button--small" aria-label="Edit (small)">
        <span className="material-icons" aria-hidden="true">
          edit
        </span>
      </button>
    </div>
  );
}
