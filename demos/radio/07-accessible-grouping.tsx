import { Radio, RadioGroup } from '@rubenchodev/materix-react/components/radio';
import { FormControl, FormLabel } from '@rubenchodev/materix-react/components/form-helper-text';

export const title = { en: 'Accessible grouping', es: 'Agrupación accesible' };
export const description = {
  en: "Every group needs an accessible name. The simplest option is label (it renders the FormLabel and aria-labelledby). Your own aria-labelledby or aria-label also work; the group always gets role=\"radiogroup\".",
  es: "Todo grupo necesita un nombre accesible. Lo más sencillo es label (renderiza el FormLabel y aria-labelledby). También sirven tu propio aria-labelledby o aria-label; el grupo siempre recibe role=\"radiogroup\".",
};

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">label prop (FormLabel + aria-labelledby)</span>
        <RadioGroup label="Payment method" defaultValue="card">
          <Radio value="card" label="Card" />
          <Radio value="transfer" label="Bank transfer" />
          <Radio value="cash" label="Cash on delivery" />
        </RadioGroup>
      </div>
      <div className="demo-group">
        <span className="demo-label">Custom aria-labelledby</span>
        <FormControl>
          <FormLabel id="radio-theme-label">Theme</FormLabel>
          <RadioGroup aria-labelledby="radio-theme-label" defaultValue="system">
            <Radio value="system" label="System default" />
            <Radio value="light" label="Light" />
            <Radio value="dark" label="Dark" />
          </RadioGroup>
        </FormControl>
      </div>
    </div>
  );
}
