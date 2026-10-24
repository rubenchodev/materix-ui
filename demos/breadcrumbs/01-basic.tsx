import { Breadcrumbs } from '@rubenchodev/materix-react/components/breadcrumbs';
import { Link } from '@rubenchodev/materix-react/components/link';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: "Links and the current page as children: links get `color=\"inherit\"` and underline on hover, separators are added and the last item gets `aria-current=\"page\"`.",
  es: "Enlaces y la página actual como hijos: los enlaces reciben `color=\"inherit\"` y subrayado en hover, se añaden los separadores y el último ítem recibe `aria-current=\"page\"`.",
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <Breadcrumbs>
        <Link href="#">Home</Link>
        <Link href="#">Catalog</Link>
        Accessories
      </Breadcrumbs>
    </div>
  );
}
