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
  'Designing accessible forms',
  'A guide to color tokens',
  'Responsive type with clamp()',
  'Shadows and elevation in MUI',
  'Visible focus states',
  'Mobile navigation patterns',
  'Sortable, filterable tables',
  'Micro-interactions with ripple',
  'Dark mode without flashing',
  'Icons on a 24px grid',
  '12-column grids',
  'Dialogs and focus management',
];
const PER_PAGE = 3;

export default function Demo() {
  const [page, setPage] = useState(1);
  const start = (page - 1) * PER_PAGE;
  return (
    <div className="demo-stack">
      <Paper variant="outlined">
        <List aria-label="Articles" aria-live="polite">
          {ARTICLES.slice(start, start + PER_PAGE).map((name, index) => (
            <ListItem key={name} icon="article" secondary={`Article ${start + index + 1} of ${ARTICLES.length}`}>
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
        aria-label="Articles pagination"
      />
    </div>
  );
}
