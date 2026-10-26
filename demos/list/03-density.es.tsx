import { List, ListItem } from '@rubenchodev/materix-react/components/list';
import { Paper } from '@rubenchodev/materix-react/components/paper';

export const title = { en: 'Density', es: 'Densidad' };
export const description = {
  en: '`dense` on the list reduces the vertical padding of its rows from 8px to 4px.',
  es: '`dense` en la lista reduce el padding vertical de sus filas de 8px a 4px.',
};

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">Normal · 8px</span>
        <Paper variant="outlined">
          <List aria-label="Archivos">
            <ListItem icon="folder">Documentos</ListItem>
            <ListItem icon="image">Fotos</ListItem>
            <ListItem icon="videocam">Vídeos</ListItem>
          </List>
        </Paper>
      </div>
      <div className="demo-group">
        <span className="demo-label">Densa · 4px</span>
        <Paper variant="outlined">
          <List dense aria-label="Archivos (densa)">
            <ListItem icon="folder">Documentos</ListItem>
            <ListItem icon="image">Fotos</ListItem>
            <ListItem icon="videocam">Vídeos</ListItem>
          </List>
        </Paper>
      </div>
    </div>
  );
}
