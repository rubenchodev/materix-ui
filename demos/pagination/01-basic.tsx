import { Pagination } from '@rubenchodev/materix-react/components/pagination';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: "`count` is enough: the component renders the `<nav>` landmark, the page buttons, the ellipsis and the translated labels. It is uncontrolled by default; `color` and `disabled` change the selected page color and the whole state.",
  es: "Basta con `count`: el componente pinta el landmark `<nav>`, los botones de página, las elipsis y las etiquetas traducidas. Por defecto no es controlado; `color` y `disabled` cambian el color de la página seleccionada y el estado de todo el componente.",
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <Pagination count={10} aria-label="Basic pagination" />
      <Pagination count={10} color="primary" aria-label="Primary pagination" />
      <Pagination count={10} color="secondary" aria-label="Secondary pagination" />
      <Pagination count={10} disabled aria-label="Disabled pagination" />
    </div>
  );
}
