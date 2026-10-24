import '@rubenchodev/materix-ui/components/stack.css';
import '@rubenchodev/materix-ui/components/divider.css';
import './demo.css';

export const title = { en: 'Manual BEM usage', es: 'Uso manual BEM' };

export const description = {
  en: 'The classes work without the component (dividers must then be written by hand: `<hr class="mtx-divider mtx-stack__divider">`).',
  es: 'Las clases funcionan sin el componente (los divisores se escriben entonces a mano: `<hr class="mtx-divider mtx-stack__divider">`).',
};

export default function Demo() {
  return (
    <div className="mtx-stack mtx-stack--column mtx-stack--sm-row mtx-stack--spacing-1 mtx-stack--sm-spacing-3 mtx-stack--align-center">
      <div className="demo-stack-item">mtx-stack--column</div>
      <hr className="mtx-divider mtx-stack__divider" aria-hidden="true" />
      <div className="demo-stack-item">mtx-stack--sm-row</div>
    </div>
  );
}
