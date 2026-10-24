import { CircularProgress, LinearProgress } from '@rubenchodev/materix-react/components/progress';

export const title = { en: 'With label', es: 'Con etiqueta' };
export const description = {
  en: "`showLabel` shows the rounded percentage: centered in the circle and to the right of the bar. The visual figure is `aria-hidden`; screen readers get the value from `aria-valuenow`.",
  es: "`showLabel` muestra el porcentaje redondeado: centrado en el círculo y a la derecha de la barra. La cifra visual es `aria-hidden`; los lectores de pantalla obtienen el valor de `aria-valuenow`.",
};

export default function Demo() {
  return (
    <div className="demo-stack demo-wide">
      <div className="demo-row">
        <CircularProgress value={10} showLabel />
        <CircularProgress value={48} showLabel track />
        <CircularProgress value={100} showLabel color="success" />
      </div>
      <LinearProgress value={35} showLabel />
      <LinearProgress value={82} showLabel color="secondary" />
    </div>
  );
}
