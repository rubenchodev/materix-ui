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
      <Breadcrumbs aria-label="ruta de navegación (columna 1)">
        <Link href="#">Tienda</Link>
        <Link href="#">Hombre</Link>
        <Link href="#">Zapatos</Link>
        Correr
      </Breadcrumbs>
      <Breadcrumbs separator="chevron_right" maxItems={3} aria-label="ruta de navegación (columna 2)">
        <Link href="#">Drive</Link>
        <Link href="#">Compartido</Link>
        <Link href="#">Diseño</Link>
        <Link href="#">2026</Link>
        Logo.svg
      </Breadcrumbs>
    </div>
  );
}
