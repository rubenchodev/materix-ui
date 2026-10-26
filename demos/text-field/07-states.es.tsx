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
          <TextField label="Ciudad" />
        </div>
        <div className="demo-group">
          <span className="demo-label">Texto de ayuda</span>
          <TextField label="Número de documento" helperText="Sin puntos ni guiones" />
        </div>
        <div className="demo-group">
          <span className="demo-label">Error + mensaje</span>
          <TextField label="Correo" error helperText="Introduce un correo válido" defaultValue="ana@" type="email" />
        </div>
        <div className="demo-group">
          <span className="demo-label">Error sin mensaje · error</span>
          <TextField label="Teléfono" helperText="El texto de ayuda se vuelve rojo" error defaultValue="12" type="tel" />
        </div>
        <div className="demo-group">
          <span className="demo-label">Obligatorio</span>
          <TextField label="Nombre" required />
        </div>
        <div className="demo-group">
          <span className="demo-label">Deshabilitado</span>
          <TextField label="Código" defaultValue="No editable" disabled />
        </div>
        <div className="demo-group">
          <span className="demo-label">Solo lectura</span>
          <TextField label="Referencia" defaultValue="ID-2026-0042" readOnly />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Error y deshabilitado en filled y standard</span>
        <div className="demo-grid-4">
          <TextField label="Filled con error" variant="filled" error helperText="Este campo es obligatorio" />
          <TextField label="Standard con error" variant="standard" error helperText="Este campo es obligatorio" />
          <TextField label="Filled deshabilitado" variant="filled" defaultValue="Bloqueado" disabled />
          <TextField label="Standard deshabilitado" variant="standard" defaultValue="Bloqueado" disabled />
        </div>
      </div>
    </div>
  );
}
