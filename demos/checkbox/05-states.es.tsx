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
        <span className="demo-label">Habilitado</span>
        <div className="demo-row demo-row--col">
          <Checkbox label="Sin marcar" />
          <Checkbox label="Marcada" defaultChecked />
          <Checkbox label="Indeterminada" indeterminate />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Deshabilitado · disabled</span>
        <div className="demo-row demo-row--col">
          <Checkbox label="Sin marcar" disabled />
          <Checkbox label="Marcada" defaultChecked disabled />
          <Checkbox label="Indeterminada" indeterminate disabled />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Error y texto de ayuda</span>
        <div className="demo-row demo-row--col">
          <Checkbox label="Términos de servicio" error helperText="Debes aceptar las condiciones." required />
          <Checkbox label="Compartir estadísticas de uso" helperText="Anónimas; puedes desactivarlo más tarde." />
        </div>
      </div>
    </div>
  );
}
