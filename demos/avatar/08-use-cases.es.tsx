import { Avatar } from '@rubenchodev/materix-react/components/avatar';
import { Badge } from '@rubenchodev/materix-react/components/badge';
import { List, ListItem } from '@rubenchodev/materix-react/components/list';

export const title = { en: 'Use cases', es: 'Casos de uso' };
export const description = {
  en: 'Online status indicator with Badge and a list of authors with List.',
  es: 'Indicador de estado en línea con Badge y una lista de autores con List.',
};

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">Estado en línea</span>
        <div className="demo-row">
          <Badge variant="dot" color="success" overlap="circular" anchor="bottom-right">
            <Avatar src="https://i.pravatar.cc/120?img=47" alt="Ana García (en línea)" />
          </Badge>
          <Badge variant="dot" overlap="circular" anchor="bottom-right">
            <Avatar color="primary" role="img" aria-label="Jorge Pérez (desconectado)">JP</Avatar>
          </Badge>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Autores de comentarios</span>
        <List className="demo-fixed-width" aria-label="Comentarios recientes">
          <ListItem avatar={<Avatar component="span" color="secondary">CR</Avatar>} secondary="Comentó hace 5 minutos">
            Carlos Ruiz
          </ListItem>
          <ListItem
            avatar={<Avatar component="span" src="https://i.pravatar.cc/120?img=32" alt="" />}
            secondary="Comentó hace 1 hora"
          >
            Lucía Martínez
          </ListItem>
        </List>
      </div>
    </div>
  );
}
