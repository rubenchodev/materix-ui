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
        <span className="demo-label">Medium · pista de 34×20px (por defecto)</span>
        <div className="demo-row">
          <Switch label="Activado" defaultChecked />
          <Switch label="Desactivado" />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Small · pista de 28×16px</span>
        <div className="demo-row">
          <Switch label="Activado" size="small" defaultChecked />
          <Switch label="Desactivado" size="small" />
        </div>
      </div>
    </div>
  );
}
