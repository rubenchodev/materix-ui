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
        title="Paella de gambas y chorizo"
        subheader="14 de septiembre de 2026"
        actionIcon="more_vert"
        image="https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=800&q=80"
      >
        <CardContent>
          Un plato mediterráneo con arroz bomba, azafrán, pollo de corral y verduras frescas, perfecto para compartir.
        </CardContent>
        <CardActions>
          <IconButton icon="favorite" aria-label="Añadir a favoritos" />
          <IconButton icon="share" aria-label="Compartir" />
        </CardActions>
      </Card>
    </div>
  );
}
