import { List, ListItemButton } from '@rubenchodev/materix-react/components/list';
import { Paper } from '@rubenchodev/materix-react/components/paper';

export const title = { en: 'Interactive rows', es: 'Filas interactivas' };
export const description = {
  en: '`ListItemButton` adds hover, focus, ripple and selection: clicking a row selects it and unselects the previous one (`defaultValue` sets the initial one). With `selectable={false}` the rows only run their action.',
  es: '`ListItemButton` añade hover, foco, ripple y selección: al pulsar una fila se selecciona y se deselecciona la anterior (`defaultValue` fija la inicial). Con `selectable={false}` las filas solo ejecutan su acción.',
};

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">Selectable</span>
        <Paper variant="outlined">
          <List aria-label="Settings" defaultValue="preferences">
            <li>
              <ListItemButton value="profile" icon="person" secondary="Name, photo and email">
                Profile
              </ListItemButton>
            </li>
            <li>
              <ListItemButton value="preferences" icon="settings" secondary="Theme and language">
                Preferences
              </ListItemButton>
            </li>
            <li>
              <ListItemButton value="security" icon="lock">
                Security
              </ListItemButton>
            </li>
          </List>
        </Paper>
      </div>
      <div className="demo-group">
        <span className="demo-label">No selection (selectable=false)</span>
        <Paper variant="outlined">
          <List selectable={false} aria-label="Actions">
            <li>
              <ListItemButton icon="file_download">Download</ListItemButton>
            </li>
            <li>
              <ListItemButton icon="share">Share</ListItemButton>
            </li>
            <li>
              <ListItemButton icon="print">Print</ListItemButton>
            </li>
          </List>
        </Paper>
      </div>
    </div>
  );
}
