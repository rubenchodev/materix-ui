import { Checkbox } from '@rubenchodev/materix-react/components/checkbox';

export const title = { en: 'Sizes', es: 'Tamaños' };
export const description = {
  en: "Two sizes, as in MUI: medium (18px box, default) and small (16px and body2 text) with size=\"small\", for tables and dense forms.",
  es: "Dos tamaños, como en MUI: medium (caja de 18px, por defecto) y small (16px y texto body2) con size=\"small\", para tablas y formularios densos.",
};

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">Medium · caja de 18px (por defecto)</span>
        <div className="demo-row">
          <Checkbox label="Medium" defaultChecked />
          <Checkbox label="Medium" />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Small · caja de 16px</span>
        <div className="demo-row">
          <Checkbox label="Small" size="small" defaultChecked />
          <Checkbox label="Small" size="small" />
        </div>
      </div>
    </div>
  );
}
