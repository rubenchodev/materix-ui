import '@rubenchodev/materix-ui/components/container.css';
import './demo.css';

export const title = { en: 'Manual BEM usage', es: 'Uso manual BEM' };

export const description = {
  en: 'The classes work without the component.',
  es: 'Las clases funcionan sin el componente.',
};

export default function Demo() {
  return (
    <div className="demo-container-frame">
      <div className="mtx-container mtx-container--sm mtx-container--disable-gutters">
        <div className="demo-container-box">mtx-container mtx-container--sm mtx-container--disable-gutters</div>
      </div>
    </div>
  );
}
