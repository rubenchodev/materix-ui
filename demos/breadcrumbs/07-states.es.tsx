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
      <Breadcrumbs aria-label="ruta de navegación (ítem deshabilitado)">
        <Link href="#">Inicio</Link>
        <Link href="#" disabled>
          Archivado
        </Link>
        Pedido n.º 4821
      </Breadcrumbs>
      <Breadcrumbs aria-label="ruta de navegación (enlaces primary)">
        <Link href="#" color="primary">
          Inicio
        </Link>
        <Link href="#" color="primary">
          Clientes
        </Link>
        Ana Torres
      </Breadcrumbs>
    </div>
  );
}
