import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@rubenchodev/materix-react/components/table';

export const title = { en: 'Sticky header', es: 'Cabecera fija' };
export const description = {
  en: '`stickyHeader` keeps the header fixed while scrolling and `maxHeight={240}` limits the height of the container, which scrolls internally and becomes a focusable, named region.',
  es: '`stickyHeader` mantiene la cabecera fija al desplazar y `maxHeight={240}` limita la altura del contenedor, que desplaza por dentro y pasa a ser una región enfocable y con nombre.',
};

const CITIES = [
  ['Nueva York', 'Nueva York', '8,258,035'],
  ['Los Angeles', 'California', '3,820,914'],
  ['Chicago', 'Illinois', '2,664,452'],
  ['Houston', 'Texas', '2,314,157'],
  ['Phoenix', 'Arizona', '1,650,070'],
  ['Filadelfia', 'Pensilvania', '1,550,542'],
  ['San Antonio', 'Texas', '1,495,295'],
  ['San Diego', 'California', '1,388,320'],
  ['Dallas', 'Texas', '1,302,868'],
  ['Jacksonville', 'Florida', '985,843'],
];

export default function Demo() {
  return (
    <TableContainer stickyHeader maxHeight={240}>
      <Table size="small" aria-label="Ciudades por población">
        <TableHead>
          <TableRow>
            <TableCell>Ciudad</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="right">Población</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {CITIES.map(([city, state, population]) => (
            <TableRow key={city}>
              <TableCell>{city}</TableCell>
              <TableCell>{state}</TableCell>
              <TableCell align="right">{population}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
