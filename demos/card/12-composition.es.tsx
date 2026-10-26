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
          title="Desarrollo web moderno"
          subheader="Arquitectura limpia en JavaScript"
          action={<IconButton icon="more_vert" aria-label="Opciones del curso" />}
        />
        <CardMedia
          height={160}
          alt="Portátil con código en pantalla"
          image="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"
        />
        <CardContent>Construye librerías de componentes sin frameworks con CSS y JavaScript estándar.</CardContent>
        <CardActions>
          <Button>Ver proyecto</Button>
          <Button>Documentación</Button>
        </CardActions>
      </Card>
    </div>
  );
}
