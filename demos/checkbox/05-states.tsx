import { Checkbox } from '@rubenchodev/materix-react/components/checkbox';

export const title = { en: 'States', es: 'Estados' };
export const description = {
  en: "Hover to see the border change color, press to see the ripple, and use Tab and Space to focus and check. The native input does not support readOnly: to lock a checkbox use disabled.",
  es: "Pasa el ratón para ver el cambio de color del borde, pulsa para ver el ripple y usa Tab y Espacio para enfocar y marcar. El input nativo no admite readOnly: para bloquear una casilla usa disabled.",
};

export default function Demo() {
  return (
    <div className="demo-grid-3">
      <div className="demo-group">
        <span className="demo-label">Enabled</span>
        <div className="demo-row demo-row--col">
          <Checkbox label="Unchecked" />
          <Checkbox label="Checked" defaultChecked />
          <Checkbox label="Indeterminate" indeterminate />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Disabled · disabled</span>
        <div className="demo-row demo-row--col">
          <Checkbox label="Unchecked" disabled />
          <Checkbox label="Checked" defaultChecked disabled />
          <Checkbox label="Indeterminate" indeterminate disabled />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Error and helper text</span>
        <div className="demo-row demo-row--col">
          <Checkbox label="Terms of service" error helperText="You must accept the terms." required />
          <Checkbox label="Share usage statistics" helperText="Anonymous; you can turn it off later." />
        </div>
      </div>
    </div>
  );
}
