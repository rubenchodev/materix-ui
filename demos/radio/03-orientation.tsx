import { Radio, RadioGroup } from '@rubenchodev/materix-react/components/radio';

export const title = { en: 'Orientation', es: 'Orientación' };
export const description = {
  en: "By default the group is vertical, the easiest layout to scan. With row the options sit in a row (and wrap when they don't fit); use it only with a few short options.",
  es: "Por defecto el grupo es vertical, la disposición más fácil de recorrer. Con row las opciones van en fila (y saltan de línea si no caben); úsalo solo con pocas opciones cortas.",
};

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">Vertical (default)</span>
        <RadioGroup aria-label="Frequency" defaultValue="daily">
          <Radio value="daily" label="Daily" />
          <Radio value="weekly" label="Weekly" />
          <Radio value="monthly" label="Monthly" />
        </RadioGroup>
      </div>
      <div className="demo-group">
        <span className="demo-label">Row · row</span>
        <RadioGroup row aria-label="Size" defaultValue="m">
          <Radio value="s" label="S" />
          <Radio value="m" label="M" />
          <Radio value="l" label="L" />
          <Radio value="xl" label="XL" />
        </RadioGroup>
      </div>
    </div>
  );
}
