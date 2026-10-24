import { TextField } from '@rubenchodev/materix-react/components/text-field';

export const title = { en: 'Multiline and auto-resize', es: 'Multilínea y auto-resize' };
export const description = {
  en: '`multiline` renders a `<textarea>`. `autoResize` grows the field as you type and `maxRows` caps the growth before showing a scrollbar.',
  es: '`multiline` genera un `<textarea>`. `autoResize` hace crecer el campo al escribir y `maxRows` limita el crecimiento antes de mostrar scroll.',
};

export default function Demo() {
  return (
    <div className="demo-grid-4">
      <div className="demo-group">
        <span className="demo-label">rows=3</span>
        <TextField label="Fixed rows" multiline rows={3} />
      </div>
      <div className="demo-group">
        <span className="demo-label">Auto-resize</span>
        <TextField label="Grows as you type" multiline autoResize rows={2} helperText="Type several lines" />
      </div>
      <div className="demo-group">
        <span className="demo-label">minRows 2 · maxRows 4</span>
        <TextField label="Filled" variant="filled" multiline minRows={2} maxRows={4} />
      </div>
      <div className="demo-group">
        <span className="demo-label">Standard</span>
        <TextField label="Standard multiline" variant="standard" multiline rows={2} />
      </div>
    </div>
  );
}
