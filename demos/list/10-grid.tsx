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
        <List aria-label="To do" subheader={<ListSubheader>To do</ListSubheader>}>
          <ListItem icon="schedule" secondary="Due tomorrow">
            Review contract
          </ListItem>
          <ListItem icon="schedule" secondary="Due Friday">
            Send invoice
          </ListItem>
        </List>
      </Paper>
      <Paper variant="outlined">
        <List aria-label="Completed" subheader={<ListSubheader>Completed</ListSubheader>}>
          <ListItem icon="task_alt" secondary="Yesterday">
            Team meeting
          </ListItem>
          <ListItem icon="task_alt" secondary="Monday">
            Supplier onboarding
          </ListItem>
        </List>
      </Paper>
    </div>
  );
}
