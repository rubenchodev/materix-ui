import { TextField } from '@rubenchodev/materix-react/components/text-field';

export const title = { en: 'Variants', es: 'Variantes' };
export const description = {
  en: '`variant`: `outlined` (default), `filled`, `standard` and `no-label` (full border without a label, for search boxes). With `select`, a native `<select>` gets a single chevron in all three variants.',
  es: '`variant`: `outlined` (por defecto), `filled`, `standard` y `no-label` (borde completo sin label, para buscadores). Con `select`, un `<select>` nativo recibe un único chevron en las tres variantes.',
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-grid-4">
        <div className="demo-group">
          <span className="demo-label">Outlined</span>
          <TextField label="Outlined" variant="outlined" />
        </div>
        <div className="demo-group">
          <span className="demo-label">Filled</span>
          <TextField label="Filled" variant="filled" />
        </div>
        <div className="demo-group">
          <span className="demo-label">Standard</span>
          <TextField label="Standard" variant="standard" />
        </div>
        <div className="demo-group">
          <span className="demo-label">Sin label</span>
          <TextField variant="no-label" startIcon="search" placeholder="Buscar…" aria-label="Buscar" type="search" />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Select nativo · un solo chevrón en las tres variantes</span>
        <div className="demo-grid-3">
          {(['outlined', 'filled', 'standard'] as const).map((variant) => (
            <TextField key={variant} select label="País" variant={variant}>
              <option>Estados Unidos</option>
              <option>Canadá</option>
              <option>Reino Unido</option>
            </TextField>
          ))}
        </div>
      </div>
    </div>
  );
}
