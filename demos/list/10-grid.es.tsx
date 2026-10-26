import { List, ListItem, ListSubheader } from '@rubenchodev/materix-react/components/list';
import { Paper } from '@rubenchodev/materix-react/components/paper';

export const title = { en: 'Grid', es: 'Grilla' };
export const description = {
  en: 'Two lists in a grid: stacked on mobile and side by side on wider screens.',
  es: 'Dos listas en una grilla: apiladas en móvil y lado a lado en pantallas anchas.',
};

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <Paper variant="outlined">
        <List aria-label="Pendientes" subheader={<ListSubheader>Pendientes</ListSubheader>}>
          <ListItem icon="schedule" secondary="Vence mañana">
            Revisar contrato
          </ListItem>
          <ListItem icon="schedule" secondary="Vence el viernes">
            Enviar factura
          </ListItem>
        </List>
      </Paper>
      <Paper variant="outlined">
        <List aria-label="Completadas" subheader={<ListSubheader>Completadas</ListSubheader>}>
          <ListItem icon="task_alt" secondary="Ayer">
            Reunión de equipo
          </ListItem>
          <ListItem icon="task_alt" secondary="Lunes">
            Alta de proveedor
          </ListItem>
        </List>
      </Paper>
    </div>
  );
}
