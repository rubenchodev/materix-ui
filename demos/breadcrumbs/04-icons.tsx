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
          Home
        </Link>
        <Link href="#" data-icon="whatshot">
          Projects
        </Link>
        <span data-icon="grain">Website redesign</span>
      </Breadcrumbs>
      <Breadcrumbs
        aria-label="breadcrumb (items)"
        separator="chevron_right"
        items={[
          { label: 'Home', href: '#', icon: 'home' },
          { label: 'Library', href: '#', icon: 'local_library' },
          { label: 'Data', icon: 'storage' },
        ]}
      />
    </div>
  );
}
