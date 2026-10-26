import { Grid } from '@rubenchodev/materix-react/components/grid';
import { Paper } from '@rubenchodev/materix-react/components/paper';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@rubenchodev/materix-react/components/table';

export const title = { en: 'Grid', es: 'Grilla' };
export const description = {
  en: 'Two tables in a `Grid`: stacked on mobile and side by side from `md`. Each one scrolls horizontally inside its container if it does not fit.',
  es: 'Dos tablas en un `Grid`: apiladas en móvil y lado a lado desde `md`. Cada una desplaza horizontalmente dentro de su contenedor si no cabe.',
};

export default function Demo() {
  return (
    <Grid container spacing={2} className="mtx-w-100">
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper variant="outlined">
          <TableContainer>
            <Table size="small" aria-label="Más vendidos">
              <TableHead>
                <TableRow>
                  <TableCell>Más vendidos</TableCell>
                  <TableCell align="right">Unidades</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow><TableCell>Teclado mecánico</TableCell><TableCell align="right">1,204</TableCell></TableRow>
                <TableRow><TableCell>Ratón inalámbrico</TableCell><TableCell align="right">986</TableCell></TableRow>
                <TableRow><TableCell>Monitor 4K 27&quot;</TableCell><TableCell align="right">412</TableCell></TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper variant="outlined">
          <TableContainer>
            <Table size="small" aria-label="Devoluciones">
              <TableHead>
                <TableRow>
                  <TableCell>Devoluciones</TableCell>
                  <TableCell>Motivo</TableCell>
                  <TableCell align="right">Casos</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow><TableCell>Auriculares</TableCell><TableCell>Defecto de fábrica</TableCell><TableCell align="right">23</TableCell></TableRow>
                <TableRow><TableCell>Cámara web HD</TableCell><TableCell>No compatible</TableCell><TableCell align="right">11</TableCell></TableRow>
                <TableRow><TableCell>Hub USB-C</TableCell><TableCell>Llegó dañado</TableCell><TableCell align="right">7</TableCell></TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  );
}
