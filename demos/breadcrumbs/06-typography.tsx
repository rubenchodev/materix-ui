import { Breadcrumbs } from '@rubenchodev/materix-react/components/breadcrumbs';
import { Link } from '@rubenchodev/materix-react/components/link';
import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'Typography', es: 'Tipografía' };
export const description = {
  en: "`body1` by default, as MUI; `variant=\"body2\"` gives a more compact trail.",
  es: "`body1` por defecto, como MUI; `variant=\"body2\"` da una ruta más compacta.",
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <Typography variant="overline" color="text-secondary">
        body1
      </Typography>
      <Breadcrumbs aria-label="breadcrumb (body1)">
        <Link href="#">Settings</Link>
        Security
      </Breadcrumbs>
      <Typography variant="overline" color="text-secondary">
        body2
      </Typography>
      <Breadcrumbs variant="body2" aria-label="breadcrumb (body2)">
        <Link href="#">Settings</Link>
        Security
      </Breadcrumbs>
    </div>
  );
}
