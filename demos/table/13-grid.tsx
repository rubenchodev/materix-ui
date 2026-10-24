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
            <Table size="small" aria-label="Best sellers">
              <TableHead>
                <TableRow>
                  <TableCell>Best sellers</TableCell>
                  <TableCell align="right">Units</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow><TableCell>Mechanical keyboard</TableCell><TableCell align="right">1,204</TableCell></TableRow>
                <TableRow><TableCell>Wireless mouse</TableCell><TableCell align="right">986</TableCell></TableRow>
                <TableRow><TableCell>4K monitor 27&quot;</TableCell><TableCell align="right">412</TableCell></TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper variant="outlined">
          <TableContainer>
            <Table size="small" aria-label="Returns">
              <TableHead>
                <TableRow>
                  <TableCell>Returns</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell align="right">Cases</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow><TableCell>Headphones</TableCell><TableCell>Factory defect</TableCell><TableCell align="right">23</TableCell></TableRow>
                <TableRow><TableCell>HD webcam</TableCell><TableCell>Not compatible</TableCell><TableCell align="right">11</TableCell></TableRow>
                <TableRow><TableCell>USB-C hub</TableCell><TableCell>Arrived damaged</TableCell><TableCell align="right">7</TableCell></TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  );
}
