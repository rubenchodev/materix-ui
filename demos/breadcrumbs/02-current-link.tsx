import { Breadcrumbs } from '@rubenchodev/materix-react/components/breadcrumbs';
import { Link } from '@rubenchodev/materix-react/components/link';

export const title = { en: 'Current page as a link', es: 'Página actual como enlace' };
export const description = {
  en: "Set `aria-current=\"page\"` yourself to keep the current page as a link; no other item is marked.",
  es: "Pon tú `aria-current=\"page\"` para mantener la página actual como enlace; no se marca ningún otro ítem.",
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <Breadcrumbs>
        <Link href="#">Home</Link>
        <Link href="#">Catalog</Link>
        <Link href="#" aria-current="page">
          Headphones
        </Link>
      </Breadcrumbs>
    </div>
  );
}
