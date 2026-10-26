import { Divider } from '@rubenchodev/materix-react/components/divider';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: '`<Divider />` renders an `<hr>`: a 1px line in the theme\'s `divider` color with an implicit separator role.',
  es: '`<Divider />` renderiza un `<hr>`: una línea de 1px en el color `divider` del tema con rol de separador implícito.',
};

export default function Demo() {
  return (
    <div className="demo-panel">
      <span>Contenido de la primera sección.</span>
      <Divider className="demo-wide" />
      <span>Contenido de la segunda sección.</span>
    </div>
  );
}
