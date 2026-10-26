import { useState } from 'react';
import { List, ListItem } from '@rubenchodev/materix-react/components/list';
import { Pagination } from '@rubenchodev/materix-react/components/pagination';
import { Paper } from '@rubenchodev/materix-react/components/paper';

export const title = { en: 'Real-world example', es: 'Ejemplo real' };
export const description = {
  en: "Client-side paginated article list: the controlled `page` slices the data shown in a `List` inside a `Paper`.",
  es: "Lista de artículos paginada en el cliente: la `page` controlada recorta los datos que se muestran en una `List` dentro de un `Paper`.",
};

const ARTICLES = [
  'Cómo diseñar formularios accesibles',
  'Guía de tokens de color',
  'Tipografía responsive con clamp()',
  'Sombras y elevación en MUI',
  'Estados de foco visibles',
  'Patrones de navegación móvil',
  'Tablas con ordenación y filtros',
  'Microinteracciones con ripple',
  'Modo oscuro sin parpadeo',
  'Iconografía en cuadrícula de 24px',
  'Rejillas de 12 columnas',
  'Diálogos y gestión del foco',
];
const PER_PAGE = 3;

export default function Demo() {
  const [page, setPage] = useState(1);
  const start = (page - 1) * PER_PAGE;
  return (
    <div className="demo-stack">
      <Paper variant="outlined">
        <List aria-label="Artículos" aria-live="polite">
          {ARTICLES.slice(start, start + PER_PAGE).map((name, index) => (
            <ListItem key={name} icon="article" secondary={`Artículo ${start + index + 1} de ${ARTICLES.length}`}>
              {name}
            </ListItem>
          ))}
        </List>
      </Paper>
      <Pagination
        count={Math.ceil(ARTICLES.length / PER_PAGE)}
        page={page}
        onChange={(_, next) => setPage(next)}
        color="primary"
        aria-label="Paginación de artículos"
      />
    </div>
  );
}
