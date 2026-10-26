import { Button } from '@rubenchodev/materix-react/components/button';
import { Checkbox } from '@rubenchodev/materix-react/components/checkbox';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';
import { List, ListItem, ListItemButton } from '@rubenchodev/materix-react/components/list';
import { Paper } from '@rubenchodev/materix-react/components/paper';

export const title = { en: 'Secondary actions', es: 'Acciones secundarias' };
export const description = {
  en: '`secondaryAction` places actions of any width at the end of the row; a trailing IconButton snaps to the edge. For a clickable row with a separate action, use `ListItem disablePadding` with a `ListItemButton` inside.',
  es: '`secondaryAction` coloca acciones de cualquier ancho al final de la fila; un IconButton final se ajusta al borde. Para una fila pulsable con una acción aparte, usa `ListItem disablePadding` con un `ListItemButton` dentro.',
};

export default function Demo() {
  return (
    <Paper variant="outlined" className="demo-wide">
      <List aria-label="Documentos">
        <ListItem
          icon="description"
          secondary="2.4 MB"
          divider
          secondaryAction={
            <>
              <IconButton icon="file_download" aria-label="Descargar Informe anual.pdf" />
              <IconButton icon="delete" aria-label="Eliminar Informe anual.pdf" />
            </>
          }
        >
          Informe anual.pdf
        </ListItem>
        <ListItem
          icon="description"
          secondary="310 KB"
          divider
          secondaryAction={<Checkbox aria-label="Marcar Presupuesto.xlsx" />}
        >
          Presupuesto.xlsx
        </ListItem>
        <ListItem
          icon="laptop_mac"
          secondary="Madrid · activo ahora"
          divider
          secondaryAction={
            <Button variant="outlined" size="small">
              Cerrar sesión
            </Button>
          }
        >
          MacBook Pro
        </ListItem>
        <ListItem disablePadding secondaryAction={<IconButton icon="more_vert" aria-label="Opciones de Proyecto Atlas" />}>
          <ListItemButton icon="folder" secondary="12 archivos" disableSelect>
            Proyecto Atlas
          </ListItemButton>
        </ListItem>
      </List>
    </Paper>
  );
}
