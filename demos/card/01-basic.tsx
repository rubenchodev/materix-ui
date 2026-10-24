import { Card, CardActions, CardContent } from '@rubenchodev/materix-react/components/card';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: '`title`, `subheader`, `avatar`, `actionIcon` and `image` generate the header and the image; the content and actions are `CardContent` and `CardActions`.',
  es: '`title`, `subheader`, `avatar`, `actionIcon` e `image` generan el encabezado y la imagen; el contenido y las acciones son `CardContent` y `CardActions`.',
};

export default function Demo() {
  return (
    <div className="demo-surface">
      <Card
        className="demo-fixed-width"
        avatar="R"
        title="Shrimp and Chorizo Paella"
        subheader="September 14, 2026"
        actionIcon="more_vert"
        image="https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=800&q=80"
      >
        <CardContent>
          A Mediterranean dish with bomba rice, saffron, free-range chicken and fresh vegetables, perfect for sharing.
        </CardContent>
        <CardActions>
          <IconButton icon="favorite" aria-label="Add to favorites" />
          <IconButton icon="share" aria-label="Share" />
        </CardActions>
      </Card>
    </div>
  );
}
