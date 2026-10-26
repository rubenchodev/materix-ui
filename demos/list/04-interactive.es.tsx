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
        <span className="demo-label">Seleccionable</span>
        <Paper variant="outlined">
          <List aria-label="Ajustes" defaultValue="preferences">
            <li>
              <ListItemButton value="profile" icon="person" secondary="Nombre, foto y correo">
                Perfil
              </ListItemButton>
            </li>
            <li>
              <ListItemButton value="preferences" icon="settings" secondary="Tema e idioma">
                Preferencias
              </ListItemButton>
            </li>
            <li>
              <ListItemButton value="security" icon="lock">
                Seguridad
              </ListItemButton>
            </li>
          </List>
        </Paper>
      </div>
      <div className="demo-group">
        <span className="demo-label">Sin selección (selectable=false)</span>
        <Paper variant="outlined">
          <List selectable={false} aria-label="Acciones">
            <li>
              <ListItemButton icon="file_download">Descargar</ListItemButton>
            </li>
            <li>
              <ListItemButton icon="share">Compartir</ListItemButton>
            </li>
            <li>
              <ListItemButton icon="print">Imprimir</ListItemButton>
            </li>
          </List>
        </Paper>
      </div>
    </div>
  );
}
