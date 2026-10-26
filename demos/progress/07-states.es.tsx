import { useId } from 'react';
import { CircularProgress, LinearProgress } from '@rubenchodev/materix-react/components/progress';
import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'States and accessibility', es: 'Estados y accesibilidad' };
export const description = {
  en: "The default accessible name is \"Loading\" / \"Cargando\" depending on the language. Customize it with `label`, `aria-label` or `aria-labelledby`. Mark the region being updated with `aria-busy=\"true\"` while it loads and remove it when done. With `prefers-reduced-motion` the animations slow down and the stroke stops shrinking.",
  es: "El nombre accesible por defecto es \"Loading\" / \"Cargando\" según el idioma. Personalízalo con `label`, `aria-label` o `aria-labelledby`. Marca la región que se actualiza con `aria-busy=\"true\"` mientras carga y quítalo al terminar. Con `prefers-reduced-motion` las animaciones se ralentizan y el trazo deja de encogerse.",
};

export default function Demo() {
  const titleId = useId();
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">Nombre personalizado (aria-labelledby)</span>
        <Typography variant="body2" component="span" id={titleId}>
          Subiendo informe.pdf
        </Typography>
        <LinearProgress value={64} aria-labelledby={titleId} />
      </div>
      <div className="demo-group">
        <span className="demo-label">Región ocupada (aria-busy)</span>
        <div className="demo-row" aria-busy="true" aria-live="polite">
          <CircularProgress size={24} label="Cargando comentarios" />
          <Typography variant="body2" component="span">
            Cargando comentarios…
          </Typography>
        </div>
      </div>
    </div>
  );
}
