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
        <span className="demo-label">Medium · 20px circle (default)</span>
        <RadioGroup row aria-label="Medium size" defaultValue="a">
          <Radio value="a" label="Option A" />
          <Radio value="b" label="Option B" />
        </RadioGroup>
      </div>
      <div className="demo-group">
        <span className="demo-label">Small · 16px circle</span>
        <RadioGroup row aria-label="Small size" defaultValue="a">
          <Radio value="a" label="Option A" size="small" />
          <Radio value="b" label="Option B" size="small" />
        </RadioGroup>
      </div>
    </div>
  );
}
