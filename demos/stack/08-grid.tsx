import './demo.css';
import { Grid } from '@rubenchodev/materix-react/components/grid';
import { Stack } from '@rubenchodev/materix-react/components/stack';

export const title = { en: 'Grid', es: 'Grilla' };

export const description = {
  en: 'A Stack inside each Grid item: the grid splits the columns and the stack arranges the content of each one.',
  es: 'Un Stack dentro de cada ítem de Grid: la grilla reparte las columnas y el stack ordena el contenido de cada una.',
};

export default function Demo() {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Stack spacing={1}>
          <div className="demo-stack-item">Column A · 1</div>
          <div className="demo-stack-item">Column A · 2</div>
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Stack spacing={1}>
          <div className="demo-stack-item">Column B · 1</div>
          <div className="demo-stack-item">Column B · 2</div>
        </Stack>
      </Grid>
    </Grid>
  );
}
