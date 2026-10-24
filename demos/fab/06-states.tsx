import { Fab } from '@rubenchodev/materix-react/components/fab';

export const title = { en: 'States', es: 'Estados' };
export const description = {
  en: 'Hover to see the elevation rise, press to see the ripple and use Tab to see the focus ring. With `disabled` it loses its elevation and color.',
  es: 'Pasa el puntero para ver cómo sube la elevación, pulsa para ver el ripple y usa Tab para ver el anillo de foco. Con `disabled` pierde la elevación y el color.',
};

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">Enabled · hover, focus and press</span>
        <div className="demo-row">
          <Fab icon="add" aria-label="Create" />
          <Fab icon="add" label="Create" />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Disabled · disabled</span>
        <div className="demo-row">
          <Fab icon="add" aria-label="Create" disabled />
          <Fab icon="add" label="Create" disabled />
        </div>
      </div>
    </div>
  );
}
