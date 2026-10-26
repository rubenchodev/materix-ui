import { Button } from '@rubenchodev/materix-react/components/button';
import { Link } from '@rubenchodev/materix-react/components/link';
import { TextField } from '@rubenchodev/materix-react/components/text-field';
import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'Real-world examples', es: 'Ejemplos reales' };
export const description = {
  en: 'Secondary links under a sign-in form and a breadcrumb trail.',
  es: 'Enlaces secundarios bajo un formulario de inicio de sesión y una ruta de navegación.',
};

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">Pie de formulario</span>
        <div className="demo-stack demo-fixed-width">
          <TextField label="Correo electrónico" variant="outlined" type="email" autoComplete="email" />
          <Button variant="contained">Iniciar sesión</Button>
          <Typography variant="body2">
            <Link href="#real-world">¿Olvidaste tu contraseña?</Link> ·{' '}
            <Link href="#real-world" color="text-secondary">
              Crear una cuenta
            </Link>
          </Typography>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Ruta de navegación</span>
        <Typography component="nav" variant="body2" aria-label="Ruta de navegación">
          <Link href="#real-world" color="text-secondary">
            Inicio
          </Link>{' '}
          /{' '}
          <Link href="#real-world" color="text-secondary">
            Proyectos
          </Link>{' '}
          / <span aria-current="page">Materix UI</span>
        </Typography>
      </div>
    </div>
  );
}
