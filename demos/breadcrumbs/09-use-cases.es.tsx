import { Breadcrumbs } from '@rubenchodev/materix-react/components/breadcrumbs';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Link } from '@rubenchodev/materix-react/components/link';
import { Stack } from '@rubenchodev/materix-react/components/stack';
import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'Real-world example: page header', es: 'Ejemplo real: cabecera de página' };
export const description = {
  en: "Admin page header: compact trail, title and main action.",
  es: "Cabecera de página de un panel: ruta compacta, título y acción principal.",
};

export default function Demo() {
  return (
    <Stack spacing={1}>
      <Breadcrumbs variant="body2">
        <Link href="#" data-icon="dashboard">
          Panel
        </Link>
        <Link href="#">Usuarios</Link>
        Editar perfil
      </Breadcrumbs>
      <Stack direction="row" wrap alignItems="center" justifyContent="space-between" spacing={2}>
        <Typography variant="h5" component="h3">
          Editar perfil
        </Typography>
        <Button variant="contained">Guardar cambios</Button>
      </Stack>
    </Stack>
  );
}
