import { Switch } from '@rubenchodev/materix-react/components/switch';

export const title = { en: 'States', es: 'Estados' };
export const description = {
  en: "Click to see the ripple on the thumb and use Tab and Space to focus and toggle. disabled dims the control; readOnly keeps it focusable and legible but blocks changes.",
  es: "Haz clic para ver el ripple en el thumb y usa Tab y Espacio para enfocar y alternar. disabled atenúa el control; readOnly lo mantiene enfocable y legible pero bloquea los cambios.",
};

export default function Demo() {
  return (
    <div className="demo-grid-3">
      <div className="demo-group">
        <span className="demo-label">Enabled</span>
        <div className="demo-row demo-row--col">
          <Switch label="Off" />
          <Switch label="On" defaultChecked />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Disabled · disabled</span>
        <div className="demo-row demo-row--col">
          <Switch label="Off" disabled />
          <Switch label="On" defaultChecked disabled />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Read-only · readOnly</span>
        <div className="demo-row demo-row--col">
          <Switch label="Backups (managed)" defaultChecked readOnly />
          <Switch label="Telemetry (managed)" readOnly />
        </div>
      </div>
    </div>
  );
}
