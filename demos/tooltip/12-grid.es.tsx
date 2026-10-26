import { Tooltip } from '@rubenchodev/materix-react/components/tooltip';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';
import { Grid } from '@rubenchodev/materix-react/components/grid';
import { Paper } from '@rubenchodev/materix-react/components/paper';
import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'Grid layout', es: 'Maquetación en grilla' };
export const description = {
  en: 'Tooltips are portaled to `<body>`: containers with `overflow` or narrow Grid columns don\'t clip them.',
  es: 'Los tooltips se portan a `<body>`: los contenedores con `overflow` o las columnas estrechas del Grid no los recortan.',
};

const CARDS = [
  { label: 'Ventas', help: 'Total facturado este mes' },
  { label: 'Pedidos', help: 'Pedidos confirmados y pagados' },
  { label: 'Devoluciones', help: 'Solicitudes de los últimos 30 días' },
];

export default function Demo() {
  return (
    <Grid container spacing={2} className="demo-wide">
      {CARDS.map(({ label, help }) => (
        <Grid key={label} size={{ xs: 12, sm: 4 }}>
          <Paper variant="outlined" className="mtx-p-2 mtx-d-flex mtx-align-items-center mtx-justify-content-between">
            <Typography component="span" variant="body2">
              {label}
            </Typography>
            <Tooltip title={help}>
              <IconButton icon="help_outline" size="small" />
            </Tooltip>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
