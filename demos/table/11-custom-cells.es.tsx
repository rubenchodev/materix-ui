import { Avatar } from '@rubenchodev/materix-react/components/avatar';
import { Chip } from '@rubenchodev/materix-react/components/chip';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';
import { LinearProgress } from '@rubenchodev/materix-react/components/progress';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@rubenchodev/materix-react/components/table';

export const title = { en: 'Custom cells', es: 'Celdas personalizadas' };
export const description = {
  en: 'Cells accept any content: avatars, status chips, progress bars and action buttons. Keep the actions right-aligned with `align="right"`; `padding="none"` removes the padding of a cell.',
  es: 'Las celdas aceptan cualquier contenido: avatares, chips de estado, barras de progreso y botones de acción. Alinea las acciones a la derecha con `align="right"`; `padding="none"` quita el relleno de una celda.',
};

const PROJECTS = [
  { owner: 'Ana García', initials: 'AG', project: 'Sistema de diseño', status: 'Activo', color: 'success', progress: 72 },
  { owner: 'Luis Pérez', initials: 'LP', project: 'API de facturación', status: 'Bloqueado', color: 'error', progress: 35 },
  { owner: 'María Torres', initials: 'MT', project: 'App móvil', status: 'En revisión', color: 'warning', progress: 90 },
] as const;

export default function Demo() {
  return (
    <TableContainer>
      <Table hover aria-label="Proyectos">
        <TableHead>
          <TableRow>
            <TableCell>Responsable</TableCell>
            <TableCell>Proyecto</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Progreso</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {PROJECTS.map((row) => (
            <TableRow key={row.project}>
              <TableCell>
                <div className="mtx-d-flex mtx-align-items-center mtx-gap-2">
                  <Avatar size="small" alt={row.owner}>{row.initials}</Avatar>
                  {row.owner}
                </div>
              </TableCell>
              <TableCell>{row.project}</TableCell>
              <TableCell>
                <Chip label={row.status} size="small" variant="outlined" color={row.color} />
              </TableCell>
              <TableCell>
                <LinearProgress value={row.progress} aria-label={`Progreso de ${row.project}`} />
              </TableCell>
              <TableCell align="right">
                <IconButton icon="edit" size="small" aria-label={`Editar ${row.project}`} />
                <IconButton icon="delete" size="small" aria-label={`Eliminar ${row.project}`} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
