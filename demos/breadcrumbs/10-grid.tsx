import { Breadcrumbs } from '@rubenchodev/materix-react/components/breadcrumbs';
import { Link } from '@rubenchodev/materix-react/components/link';

export const title = { en: 'Grid layout', es: 'Maquetación en grilla' };
export const description = {
  en: "The trail wraps inside its grid column; the second one collapses with `maxItems`.",
  es: "La ruta se ajusta dentro de su columna; la segunda se colapsa con `maxItems`.",
};

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <Breadcrumbs aria-label="breadcrumb (column 1)">
        <Link href="#">Store</Link>
        <Link href="#">Men</Link>
        <Link href="#">Shoes</Link>
        Running
      </Breadcrumbs>
      <Breadcrumbs separator="chevron_right" maxItems={3} aria-label="breadcrumb (column 2)">
        <Link href="#">Drive</Link>
        <Link href="#">Shared</Link>
        <Link href="#">Design</Link>
        <Link href="#">2026</Link>
        Logo.svg
      </Breadcrumbs>
    </div>
  );
}
