import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  paginateRows,
} from '@rubenchodev/materix-react/components/table';

export const title = { en: 'Pagination', es: 'Paginación' };
export const description = {
  en: '`TablePagination` with a native rows-per-page select, the displayed range and first/previous/next/last buttons; `paginateRows` slices the data. `-1` in `rowsPerPageOptions` is "All" and `count={-1}` an unknown total. Its texts follow the active language.',
  es: '`TablePagination` con selector nativo de filas por página, el rango mostrado y botones de primera/anterior/siguiente/última; `paginateRows` corta los datos. `-1` en `rowsPerPageOptions` es "Todas" y `count={-1}` un total desconocido. Sus textos siguen el idioma activo.',
};

const COUNTRIES = [
  ['AR', 'Argentina', 'Buenos Aires'],
  ['BO', 'Bolivia', 'Sucre'],
  ['CL', 'Chile', 'Santiago'],
  ['CO', 'Colombia', 'Bogotá'],
  ['CR', 'Costa Rica', 'San José'],
  ['EC', 'Ecuador', 'Quito'],
  ['ES', 'España', 'Madrid'],
  ['MX', 'México', 'Ciudad de México'],
  ['PE', 'Perú', 'Lima'],
  ['UY', 'Uruguay', 'Montevideo'],
];

export default function Demo() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const visible = paginateRows(COUNTRIES, page, rowsPerPage);
  return (
    <div className="demo-stack">
      <div>
        <TableContainer>
          <Table size="small" aria-label="Países">
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>País</TableCell>
                <TableCell>Capital</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visible.map(([code, country, capital]) => (
                <TableRow key={code}>
                  <TableCell>{code}</TableCell>
                  <TableCell>{country}</TableCell>
                  <TableCell>{capital}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          count={COUNTRIES.length}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[4, 8, -1]}
          showFirstButton
          showLastButton
          onPageChange={(_event, next) => setPage(next)}
          onRowsPerPageChange={(_event, next) => {
            setRowsPerPage(next);
            setPage(0);
          }}
        />
      </div>
      <div className="demo-group">
        <span className="demo-label">Deshabilitado · total desconocido (count = -1)</span>
        <TablePagination count={-1} defaultRowsPerPage={10} disabled />
      </div>
    </div>
  );
}
