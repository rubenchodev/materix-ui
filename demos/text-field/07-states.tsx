import { TextField } from '@rubenchodev/materix-react/components/text-field';

export const title = { en: 'States', es: 'Estados' };
export const description = {
  en: 'Normal, helper text, error with a message (`error` + `helperText`), required, disabled and read-only. Hover to see the hover state and use Tab to see focus.',
  es: 'Normal, texto de ayuda, error con mensaje (`error` + `helperText`), obligatorio, deshabilitado y solo lectura. Pasa el ratón para ver el estado hover y usa Tab para ver el foco.',
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-grid-3">
        <div className="demo-group">
          <span className="demo-label">Normal</span>
          <TextField label="City" />
        </div>
        <div className="demo-group">
          <span className="demo-label">Helper text</span>
          <TextField label="ID number" helperText="No dots or dashes" />
        </div>
        <div className="demo-group">
          <span className="demo-label">Error + message</span>
          <TextField label="Email" error helperText="Enter a valid email" defaultValue="jane@" type="email" />
        </div>
        <div className="demo-group">
          <span className="demo-label">Error without message · error</span>
          <TextField label="Phone" helperText="The helper text turns red" error defaultValue="12" type="tel" />
        </div>
        <div className="demo-group">
          <span className="demo-label">Required</span>
          <TextField label="Name" required />
        </div>
        <div className="demo-group">
          <span className="demo-label">Disabled</span>
          <TextField label="Code" defaultValue="Not editable" disabled />
        </div>
        <div className="demo-group">
          <span className="demo-label">Read-only</span>
          <TextField label="Reference" defaultValue="ID-2026-0042" readOnly />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Error and disabled in filled and standard</span>
        <div className="demo-grid-4">
          <TextField label="Filled error" variant="filled" error helperText="This field is required" />
          <TextField label="Standard error" variant="standard" error helperText="This field is required" />
          <TextField label="Filled disabled" variant="filled" defaultValue="Locked" disabled />
          <TextField label="Standard disabled" variant="standard" defaultValue="Locked" disabled />
        </div>
      </div>
    </div>
  );
}
