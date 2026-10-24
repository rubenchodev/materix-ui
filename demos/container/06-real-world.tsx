import '@rubenchodev/materix-ui/utilities.css';
import './demo.css';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Container } from '@rubenchodev/materix-react/components/container';
import { Stack } from '@rubenchodev/materix-react/components/stack';
import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'Real-world use cases', es: 'Casos de uso reales' };

export const description = {
  en: 'An article page: a full-width header and a reading body capped at `sm` to keep a comfortable line length.',
  es: 'Una página de artículo: una cabecera a todo el ancho y un cuerpo de lectura limitado a `sm` para mantener una longitud de línea cómoda.',
};

export default function Demo() {
  return (
    <div className="demo-container-frame">
      <div className="mtx-bg-primary mtx-py-4">
        <Container maxWidth="md">
          <Typography variant="h5" component="h3" gutterBottom color="inherit">
            What&apos;s new in version 0.1
          </Typography>
          <Typography variant="body2" color="inherit">
            Layout utilities, Container and Stack.
          </Typography>
        </Container>
      </div>
      <Container component="article" maxWidth="sm" className="mtx-py-3">
        <Typography variant="body1" className="mtx-mb-2">
          Materix ships a mobile-first utility system for building layouts without writing your own CSS. Container
          centers the content and Stack stacks blocks with even spacing.
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="contained">Read more</Button>
          <Button variant="text">Share</Button>
        </Stack>
      </Container>
    </div>
  );
}
