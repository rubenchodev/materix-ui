import { Switch } from '@rubenchodev/materix-react/components/switch';

export const title = { en: 'Helper and error (FormHelperText)', es: 'Ayuda y error (FormHelperText)' };
export const description = {
  en: "helperText adds a .mtx-form-helper-text below the switch, linked with aria-describedby. error turns on the error state with aria-invalid=\"true\"; pass the message as helperText.",
  es: "helperText añade un .mtx-form-helper-text bajo el interruptor, enlazado con aria-describedby. error activa el estado de error con aria-invalid=\"true\"; pasa el mensaje como helperText.",
};

export default function Demo() {
  return (
    <div className="demo-grid-3">
      <div className="demo-group">
        <span className="demo-label">Helper text</span>
        <Switch label="Automatic backups" helperText="Every night at 2:00 AM." defaultChecked />
      </div>
      <div className="demo-group">
        <span className="demo-label">Error with message</span>
        <Switch label="Two-step verification" error helperText="Required for administrators." />
      </div>
      <div className="demo-group">
        <span className="demo-label">Disabled with helper</span>
        <Switch label="Security alerts" helperText="Always on." defaultChecked disabled />
      </div>
    </div>
  );
}
