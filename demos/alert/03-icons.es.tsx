import { Alert } from '@rubenchodev/materix-react/components/alert';
import { Grid } from '@rubenchodev/materix-react/components/grid';

export const title = { en: 'With and without icons', es: 'Con y sin iconos' };
export const description = {
  en: 'The 22px severity SVG by default; `icon` replaces it and `icon={false}` removes it.',
  es: 'El SVG de 22px de la severidad por defecto; `icon` lo sustituye e `icon={false}` lo elimina.',
};

export default function Demo() {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 4 }}>
        <div className="demo-group">
          <span className="demo-label">Icono automático</span>
          <Alert severity="info">Icono generado según la severidad.</Alert>
        </div>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <div className="demo-group">
          <span className="demo-label">Icono personalizado</span>
          <Alert
            severity="success"
            icon={
              <span className="material-icons" aria-hidden="true">
                cloud_done
              </span>
            }
          >
            Copia de seguridad completada.
          </Alert>
        </div>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <div className="demo-group">
          <span className="demo-label">Sin icono</span>
          <Alert severity="warning" icon={false}>
            Alerta sin icono.
          </Alert>
        </div>
      </Grid>
    </Grid>
  );
}
