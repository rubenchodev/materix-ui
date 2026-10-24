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
        <span className="demo-label">Normal · clickable (hover, focus, pressed)</span>
        <div className="demo-row">
          <Chip label="Static" />
          <Chip label="Clickable" clickable />
          <Chip label="Clickable primary" clickable color="primary" />
          <Chip label="Clickable outlined" clickable variant="outlined" />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">On a native &lt;button&gt;</span>
        <div className="demo-row">
          <Chip component="button" type="button" label="Button filled" clickable />
          <Chip component="button" type="button" label="Button outlined" variant="outlined" clickable />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Disabled</span>
        <div className="demo-row">
          <Chip label="Disabled" disabled />
          <Chip label="Outlined" variant="outlined" disabled />
          <Chip label="Clickable" color="primary" disabled onClick={() => {}} />
          <Chip label="Deletable" disabled onDelete={() => {}} />
        </div>
      </div>
    </div>
  );
}
