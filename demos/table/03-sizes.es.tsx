import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@rubenchodev/materix-react/components/table';
import type { TableSize } from '@rubenchodev/materix-react/components/table';

export const title = { en: 'Sizes', es: 'Tamaños' };
export const description = {
  en: 'Normal (16px padding) and `size="small"` (6px vertical) for tables with many rows. A single cell can also take `size`.',
  es: 'Normal (relleno de 16px) y `size="small"` (6px vertical) para tablas con muchas filas. Una celda suelta también admite `size`.',
};

const USERS = [
  { name: 'Ana García', logins: 128 },
  { name: 'Luis Pérez', logins: 57 },
];

function Users({ size }: { size: TableSize }) {
  return (
    <TableContainer>
      <Table size={size} aria-label={size === 'small' ? 'Usuarios (small)' : 'Usuarios (normal)'}>
        <TableHead>
          <TableRow>
            <TableCell>Usuario</TableCell>
            <TableCell align="right">Accesos</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {USERS.map((user) => (
            <TableRow key={user.name}>
              <TableCell>{user.name}</TableCell>
              <TableCell align="right">{user.logins}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">Normal</span>
        <Users size="medium" />
      </div>
      <div className="demo-group">
        <span className="demo-label">Small</span>
        <Users size="small" />
      </div>
    </div>
  );
}
