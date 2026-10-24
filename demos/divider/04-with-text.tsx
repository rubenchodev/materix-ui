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
        <span className="demo-label">Centered (children)</span>
        <Divider>CENTER</Divider>
      </div>
      <div className="demo-group">
        <span className="demo-label">Left (textAlign="left")</span>
        <Divider textAlign="left">LEFT</Divider>
      </div>
      <div className="demo-group">
        <span className="demo-label">Right (textAlign="right")</span>
        <Divider textAlign="right">RIGHT</Divider>
      </div>
    </div>
  );
}
