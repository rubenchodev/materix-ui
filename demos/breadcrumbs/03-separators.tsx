import { Breadcrumbs } from '@rubenchodev/materix-react/components/breadcrumbs';
import { Link } from '@rubenchodev/materix-react/components/link';

export const title = { en: 'Separators', es: 'Separadores' };
export const description = {
  en: "`separator` accepts text, a node or a Material icon name such as `navigate_next`.",
  es: "`separator` acepta texto, un nodo o un nombre de icono Material como `navigate_next`.",
};

const SEPARATORS = ['›', '-', 'navigate_next'];

export default function Demo() {
  return (
    <div className="demo-stack">
      {SEPARATORS.map((separator) => (
        <Breadcrumbs key={separator} separator={separator} aria-label={`breadcrumb (${separator})`}>
          <Link href="#">Home</Link>
          <Link href="#">Catalog</Link>
          Accessories
        </Breadcrumbs>
      ))}
    </div>
  );
}
