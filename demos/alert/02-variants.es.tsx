import { Alert, type AlertVariant } from '@rubenchodev/materix-react/components/alert';
import { Grid } from '@rubenchodev/materix-react/components/grid';

export const title = { en: 'Variants', es: 'Variantes' };
export const description = {
  en: '`standard` (soft background, default), `filled` (solid background) and `outlined` (border only).',
  es: '`standard` (fondo suave, por defecto), `filled` (fondo sólido) y `outlined` (solo borde).',
};

const VARIANTS: Array<[AlertVariant, string]> = [
  ['standard', 'Standard'],
  ['filled', 'Filled'],
  ['outlined', 'Outlined'],
];

export default function Demo() {
  return (
    <Grid container spacing={2}>
      {VARIANTS.map(([variant, name]) => (
        <Grid key={variant} size={{ xs: 12, md: 4 }}>
          <div className="demo-group">
            <span className="demo-label">{name}</span>
            <div className="demo-stack">
              <Alert severity="success" variant={variant}>
                Éxito: pedido confirmado.
              </Alert>
              <Alert severity="info" variant={variant}>
                Información: hay una versión nueva disponible.
              </Alert>
              <Alert severity="warning" variant={variant}>
                Advertencia: tu plan vence pronto.
              </Alert>
              <Alert severity="error" variant={variant}>
                Error: el pago fue rechazado.
              </Alert>
            </div>
          </div>
        </Grid>
      ))}
    </Grid>
  );
}
