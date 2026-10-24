import { TextField } from '@rubenchodev/materix-react/components/text-field';

export const title = { en: 'Counters and limits', es: 'Contadores y límites' };
export const description = {
  en: '`counter="characters|words|both"` with `maxChars` (or `maxLength`) and `maxWords`. When the limit is exceeded the field switches to the error state.',
  es: '`counter="characters|words|both"` con `maxChars` (o `maxLength`) y `maxWords`. Al superar el límite el campo pasa a estado de error.',
};

export default function Demo() {
  return (
    <div className="demo-grid-3">
      <div className="demo-group">
        <span className="demo-label">Characters · max. 25</span>
        <TextField label="Title" counter="characters" maxChars={25} helperText="Short and descriptive" />
      </div>
      <div className="demo-group">
        <span className="demo-label">Words · max. 15</span>
        <TextField label="Summary" multiline maxWords={15} helperText="Keywords" rows={3} />
      </div>
      <div className="demo-group">
        <span className="demo-label">Both · 30 words / 150 characters</span>
        <TextField label="Comment" multiline counter="both" maxWords={30} maxChars={150} rows={3} />
      </div>
    </div>
  );
}
