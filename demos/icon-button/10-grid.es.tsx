import { Grid } from '@rubenchodev/materix-react/components/grid';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';

export const title = { en: 'Grid', es: 'Grilla' };
export const description = {
  en: 'Inside a Grid the IconButton keeps its fixed size (it does not stretch): the cells share the width and the button keeps its 48px touch area.',
  es: 'Dentro de un Grid el IconButton mantiene su tamaño fijo (no se estira): las celdas reparten el ancho y el botón conserva su área táctil de 48px.',
};

const items = [
  ['photo_camera', 'Cámara'],
  ['image', 'Galería'],
  ['description', 'Documento'],
  ['place', 'Ubicación'],
] as const;

export default function Demo() {
  return (
    <Grid container spacing={2}>
      {items.map(([icon, label]) => (
        <Grid key={icon} size={{ xs: 6, sm: 3 }}>
          <div className="demo-panel">
            <IconButton icon={icon} size="large" color="primary" aria-label={label} />
            <span className="demo-label">{label}</span>
          </div>
        </Grid>
      ))}
    </Grid>
  );
}
