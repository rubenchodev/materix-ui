import { Breadcrumbs } from '@rubenchodev/materix-react/components/breadcrumbs';
import { Link } from '@rubenchodev/materix-react/components/link';

export const title = { en: 'States', es: 'Estados' };
export const description = {
  en: "Links keep the Link states: a `disabled` item leaves the tab order and its own `color` overrides `inherit`.",
  es: "Los enlaces conservan los estados de Link: un ítem `disabled` sale del orden de tabulación y su propio `color` sustituye a `inherit`.",
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <Breadcrumbs aria-label="breadcrumb (disabled item)">
        <Link href="#">Home</Link>
        <Link href="#" disabled>
          Archived
        </Link>
        Order #4821
      </Breadcrumbs>
      <Breadcrumbs aria-label="breadcrumb (primary links)">
        <Link href="#" color="primary">
          Home
        </Link>
        <Link href="#" color="primary">
          Customers
        </Link>
        Ana Torres
      </Breadcrumbs>
    </div>
  );
}
