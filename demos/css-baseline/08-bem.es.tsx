import '@rubenchodev/materix-ui/base.css';
import './demo.css';

export const title = { en: 'Manual BEM usage', es: 'Uso manual BEM' };

export const description = {
  en: 'Without the component, the `mtx-root` class on the root element is enough.',
  es: 'Sin el componente, basta con la clase `mtx-root` en el elemento raíz.',
};

export default function Demo() {
  return (
    <div className="demo-css-baseline-box mtx-root">
      <p>
        Contenedor con <code>className=&quot;mtx-root&quot;</code>.
      </p>
    </div>
  );
}
