import { Autocomplete } from '@rubenchodev/materix-react/components/autocomplete';
import { FILMS } from './data';

export const title = { en: 'Variants', es: 'Variantes' };
export const description = {
  en: 'The same as TextField with `variant`: `outlined` (default), `filled` and `standard`.',
  es: 'Las mismas que TextField con `variant`: `outlined` (por defecto), `filled` y `standard`.',
};

export default function Demo() {
  return (
    <div className="demo-grid-3">
      <div className="demo-group">
        <span className="demo-label">Outlined</span>
        <Autocomplete label="Movie" options={FILMS} />
      </div>
      <div className="demo-group">
        <span className="demo-label">Filled</span>
        <Autocomplete label="Movie" variant="filled" options={FILMS} />
      </div>
      <div className="demo-group">
        <span className="demo-label">Standard</span>
        <Autocomplete label="Movie" variant="standard" options={FILMS} />
      </div>
    </div>
  );
}
