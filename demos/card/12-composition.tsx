import { Avatar } from '@rubenchodev/materix-react/components/avatar';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Card, CardActions, CardContent, CardHeader, CardMedia } from '@rubenchodev/materix-react/components/card';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';

export const title = { en: 'Composition with subcomponents', es: 'Composición con subcomponentes' };
export const description = {
  en: 'For fine-grained control (the equivalent of the vanilla BEM syntax), compose `CardHeader`, `CardMedia`, `CardContent` and `CardActions` yourself.',
  es: 'Para un control fino (el equivalente a la sintaxis BEM de vanilla), compón tú mismo `CardHeader`, `CardMedia`, `CardContent` y `CardActions`.',
};

export default function Demo() {
  return (
    <div className="demo-surface">
      <Card component="article" className="demo-fixed-width">
        <CardHeader
          component="header"
          avatar={<Avatar color="secondary">JS</Avatar>}
          title="Modern web development"
          subheader="Clean architecture in JavaScript"
          action={<IconButton icon="more_vert" aria-label="Course options" />}
        />
        <CardMedia
          height={160}
          alt="Laptop with code on screen"
          image="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"
        />
        <CardContent>Build component libraries without frameworks using standard CSS and JavaScript.</CardContent>
        <CardActions>
          <Button>View project</Button>
          <Button>Documentation</Button>
        </CardActions>
      </Card>
    </div>
  );
}
