import { Divider } from '@rubenchodev/materix-react/components/divider';

export const title = { en: 'With text', es: 'Con texto' };
export const description = {
  en: 'Write the text as the `children`. `textAlign` moves it to `left` or `right`; it is centered by default.',
  es: 'Escribe el texto como `children`. `textAlign` lo lleva a `left` o `right`; por defecto va centrado.',
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">Centrado (children)</span>
        <Divider>CENTRO</Divider>
      </div>
      <div className="demo-group">
        <span className="demo-label">Izquierda (textAlign="left")</span>
        <Divider textAlign="left">IZQUIERDA</Divider>
      </div>
      <div className="demo-group">
        <span className="demo-label">Derecha (textAlign="right")</span>
        <Divider textAlign="right">DERECHA</Divider>
      </div>
    </div>
  );
}
