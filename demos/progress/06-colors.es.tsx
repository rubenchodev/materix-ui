import { CircularProgress, LinearProgress, type ProgressColor } from '@rubenchodev/materix-react/components/progress';
import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'Colors', es: 'Colores' };
export const description = {
  en: "`color` accepts the palette colors and `inherit` (takes the container's text color). The linear track is lightened in the light theme and darkened in the dark theme.",
  es: "`color` acepta los colores de la paleta e `inherit` (toma el color del texto del contenedor). La pista lineal se aclara en el tema claro y se oscurece en el oscuro.",
};

const COLORS: ProgressColor[] = ['primary', 'secondary', 'error', 'warning', 'info', 'success'];

export default function Demo() {
  return (
    <div className="demo-stack demo-wide">
      <div className="demo-row">
        {COLORS.map((color) => (
          <CircularProgress key={color} color={color} label={`Cargando (${color})`} />
        ))}
        <Typography color="text-secondary" component="span">
          <CircularProgress color="inherit" label="Cargando (inherit)" />
        </Typography>
      </div>
      {COLORS.map((color) => (
        <LinearProgress key={color} color={color} value={color === 'success' ? undefined : 50} label={`Progreso (${color})`} />
      ))}
    </div>
  );
}
