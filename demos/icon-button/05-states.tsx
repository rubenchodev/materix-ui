import { IconButton } from '@rubenchodev/materix-react/components/icon-button';

export const title = { en: 'States', es: 'Estados' };
export const description = {
  en: 'Hover to see the hover background, press to see the centered ripple and use Tab to see the focus ring. Disable it with `disabled`.',
  es: 'Pasa el puntero para ver el fondo de hover, pulsa para ver el ripple centrado y usa Tab para ver el anillo de foco. Deshabilítalo con `disabled`.',
};

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">Enabled · hover, focus and press</span>
        <div className="demo-row">
          <IconButton icon="lock_open" aria-label="Unlock" />
          <IconButton icon="lock_open" color="primary" aria-label="Unlock (primary)" />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Disabled · disabled</span>
        <div className="demo-row">
          <IconButton icon="lock" aria-label="Locked" disabled />
          <IconButton icon="lock" color="primary" aria-label="Locked (primary)" disabled />
        </div>
      </div>
    </div>
  );
}
