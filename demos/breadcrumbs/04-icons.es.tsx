import { Breadcrumbs } from '@rubenchodev/materix-react/components/breadcrumbs';
import { Link } from '@rubenchodev/materix-react/components/link';

export const title = { en: 'With icons', es: 'Con iconos' };
export const description = {
  en: "`data-icon` on a child, or `icon` in `items`, adds a decorative icon; only the label is underlined on hover.",
  es: "`data-icon` en un hijo, o `icon` en `items`, añade un icono decorativo; en hover solo se subraya la etiqueta.",
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <Breadcrumbs>
        <Link href="#" data-icon="home">
          Inicio
        </Link>
        <Link href="#" data-icon="whatshot">
          Proyectos
        </Link>
        <span data-icon="grain">Rediseño del sitio web</span>
      </Breadcrumbs>
      <Breadcrumbs
        aria-label="ruta de navegación (items)"
        separator="chevron_right"
        items={[
          { label: 'Inicio', href: '#', icon: 'home' },
          { label: 'Biblioteca', href: '#', icon: 'local_library' },
          { label: 'Datos', icon: 'storage' },
        ]}
      />
    </div>
  );
}
