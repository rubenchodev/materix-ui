import { Chip } from '@rubenchodev/materix-react/components/chip';

export const title = { en: 'States', es: 'Estados' };
export const description = {
  en: 'Hover, focus (Tab) and press the clickable chips; `component="button"` renders a native button and `disabled` blocks all interaction.',
  es: 'Pasa el ratón, enfoca (Tab) y pulsa los chips clicables; `component="button"` usa un botón nativo y `disabled` bloquea toda interacción.',
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">Normal · clicable (hover, foco, pulsado)</span>
        <div className="demo-row">
          <Chip label="Estático" />
          <Chip label="Clicable" clickable />
          <Chip label="Clicable primario" clickable color="primary" />
          <Chip label="Clicable con borde" clickable variant="outlined" />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Sobre un &lt;button&gt; nativo</span>
        <div className="demo-row">
          <Chip component="button" type="button" label="Botón relleno" clickable />
          <Chip component="button" type="button" label="Botón con borde" variant="outlined" clickable />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Deshabilitado</span>
        <div className="demo-row">
          <Chip label="Deshabilitado" disabled />
          <Chip label="Con borde" variant="outlined" disabled />
          <Chip label="Clicable" color="primary" disabled onClick={() => {}} />
          <Chip label="Eliminable" disabled onDelete={() => {}} />
        </div>
      </div>
    </div>
  );
}
