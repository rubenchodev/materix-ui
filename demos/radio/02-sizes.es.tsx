import { Radio, RadioGroup } from '@rubenchodev/materix-react/components/radio';

export const title = { en: 'Sizes', es: 'Tamaños' };
export const description = {
  en: "Two sizes: medium (20px circle, default) and small (16px with body2 text) via size=\"small\".",
  es: "Dos tamaños: medium (círculo de 20px, por defecto) y small (16px con texto body2) con size=\"small\".",
};

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">Medium · círculo de 20px (por defecto)</span>
        <RadioGroup row aria-label="Tamaño mediano" defaultValue="a">
          <Radio value="a" label="Opción A" />
          <Radio value="b" label="Opción B" />
        </RadioGroup>
      </div>
      <div className="demo-group">
        <span className="demo-label">Small · círculo de 16px</span>
        <RadioGroup row aria-label="Tamaño pequeño" defaultValue="a">
          <Radio value="a" label="Opción A" size="small" />
          <Radio value="b" label="Opción B" size="small" />
        </RadioGroup>
      </div>
    </div>
  );
}
