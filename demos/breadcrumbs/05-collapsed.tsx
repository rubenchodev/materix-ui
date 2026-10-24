import { Breadcrumbs } from '@rubenchodev/materix-react/components/breadcrumbs';
import { Link } from '@rubenchodev/materix-react/components/link';

export const title = { en: 'Collapsed breadcrumbs', es: 'Ruta colapsada' };
export const description = {
  en: "Above `maxItems` only `itemsBeforeCollapse` and `itemsAfterCollapse` stay visible around a \"Show path\" button that reveals the rest and moves focus.",
  es: "Por encima de `maxItems` solo quedan visibles `itemsBeforeCollapse` e `itemsAfterCollapse` alrededor de un botón \"Mostrar ruta\" que revela el resto y mueve el foco.",
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <Breadcrumbs maxItems={2} aria-label="breadcrumb (maxItems 2)">
        <Link href="#">Home</Link>
        <Link href="#">Catalog</Link>
        <Link href="#">Accessories</Link>
        <Link href="#">New collection</Link>
        Belts
      </Breadcrumbs>
      <Breadcrumbs
        maxItems={4}
        itemsBeforeCollapse={2}
        itemsAfterCollapse={2}
        separator="navigate_next"
        aria-label="breadcrumb (2 + 2)"
      >
        <Link href="#">Home</Link>
        <Link href="#">Documents</Link>
        <Link href="#">2026</Link>
        <Link href="#">Accounting</Link>
        <Link href="#">Q3</Link>
        Invoices
      </Breadcrumbs>
    </div>
  );
}
