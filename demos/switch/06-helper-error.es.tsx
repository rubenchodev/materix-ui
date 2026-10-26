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
        <span className="demo-label">Texto de ayuda</span>
        <Switch label="Copias de seguridad automáticas" helperText="Cada noche a las 2:00." defaultChecked />
      </div>
      <div className="demo-group">
        <span className="demo-label">Error con mensaje</span>
        <Switch label="Verificación en dos pasos" error helperText="Obligatoria para administradores." />
      </div>
      <div className="demo-group">
        <span className="demo-label">Deshabilitado con ayuda</span>
        <Switch label="Alertas de seguridad" helperText="Siempre activadas." defaultChecked disabled />
      </div>
    </div>
  );
}
