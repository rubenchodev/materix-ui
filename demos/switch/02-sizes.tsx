import { Switch } from '@rubenchodev/materix-react/components/switch';

export const title = { en: 'Sizes', es: 'Tamaños' };
export const description = {
  en: "Two sizes: medium (34×20px track, default) and small (28×16px and body2 text) with size=\"small\".",
  es: "Dos tamaños: medium (pista de 34×20px, por defecto) y small (28×16px y texto body2) con size=\"small\".",
};

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">Medium · 34×20px track (default)</span>
        <div className="demo-row">
          <Switch label="On" defaultChecked />
          <Switch label="Off" />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Small · 28×16px track</span>
        <div className="demo-row">
          <Switch label="On" size="small" defaultChecked />
          <Switch label="Off" size="small" />
        </div>
      </div>
    </div>
  );
}
