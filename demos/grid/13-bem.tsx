import './demo.css';
import '@rubenchodev/materix-ui/components/grid.css';

export const title = { en: 'Manual BEM usage', es: 'Uso manual BEM' };

export const description = {
  en: 'With the classes written by hand the grid works without the component.',
  es: 'Con las clases escritas a mano la grilla funciona sin el componente.',
};

export default function Demo() {
  return (
    <div className="mtx-grid mtx-grid--container mtx-grid--spacing-2 mtx-grid--justify-center">
      <div className="mtx-grid mtx-grid--item mtx-grid--xs-12 mtx-grid--md-5">
        <div className="demo-grid-item">mtx-grid--xs-12 mtx-grid--md-5</div>
      </div>
      <div className="mtx-grid mtx-grid--item mtx-grid--xs-12 mtx-grid--md-5">
        <div className="demo-grid-item">mtx-grid--xs-12 mtx-grid--md-5</div>
      </div>
    </div>
  );
}
