import { LinearProgress } from '@rubenchodev/materix-react/components/progress';

export const title = { en: 'Linear', es: 'Lineal' };
export const description = {
  en: "Four variants: `indeterminate`, `determinate`, `buffer` (inferred from `valueBuffer`) and `query` (reversed indeterminate, for the phase before loading starts). 4px high, as in MUI.",
  es: "Cuatro variantes: `indeterminate`, `determinate`, `buffer` (se infiere de `valueBuffer`) y `query` (indeterminado invertido, para la fase previa a la carga). 4px de alto, como en MUI.",
};

export default function Demo() {
  return (
    <div className="demo-stack demo-wide">
      <div className="demo-group">
        <span className="demo-label">Indeterminate</span>
        <LinearProgress />
      </div>
      <div className="demo-group">
        <span className="demo-label">Determinate · 60</span>
        <LinearProgress value={60} />
      </div>
      <div className="demo-group">
        <span className="demo-label">Buffer · 30 / 55</span>
        <LinearProgress value={30} valueBuffer={55} />
      </div>
      <div className="demo-group">
        <span className="demo-label">Query</span>
        <LinearProgress variant="query" />
      </div>
      <div className="demo-group">
        <span className="demo-label">Rounded</span>
        <LinearProgress value={70} rounded />
      </div>
    </div>
  );
}
