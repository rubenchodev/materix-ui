import { Button } from '@rubenchodev/materix-react/components/button';
import { ButtonGroup } from '@rubenchodev/materix-react/components/button-group';
import { Grid } from '@rubenchodev/materix-react/components/grid';

export const title = { en: 'Grid layout', es: 'Maquetación en grilla' };
export const description = {
  en: "With `fullWidth` the group adapts to the grid column.",
  es: "Con `fullWidth` el grupo se adapta a la columna de la grilla.",
};

export default function Demo() {
  return (
    <Grid container spacing={2}>
      <Grid xs={12} md={6}>
        <ButtonGroup fullWidth label="Periodo">
          <Button>Día</Button>
          <Button>Semana</Button>
          <Button>Mes</Button>
        </ButtonGroup>
      </Grid>
      <Grid xs={12} md={6}>
        <ButtonGroup fullWidth variant="contained" label="Exportar">
          <Button startIcon="picture_as_pdf">PDF</Button>
          <Button startIcon="table_view">CSV</Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  );
}
