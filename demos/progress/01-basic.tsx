import { CircularProgress, LinearProgress } from '@rubenchodev/materix-react/components/progress';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: "A single `<CircularProgress />` or `<LinearProgress />` renders the SVG or the bars, the `role=\"progressbar\"` and the accessible name. Without `value` it is indeterminate; with `value` it becomes determinate.",
  es: "Un único `<CircularProgress />` o `<LinearProgress />` renderiza el SVG o las barras, el `role=\"progressbar\"` y el nombre accesible. Sin `value` es indeterminado; con `value` pasa a determinado.",
};

export default function Demo() {
  return (
    <div className="demo-stack demo-wide">
      <div className="demo-row">
        <CircularProgress />
        <CircularProgress value={75} />
      </div>
      <LinearProgress />
      <LinearProgress value={40} />
    </div>
  );
}
