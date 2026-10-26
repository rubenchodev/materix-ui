import { Accordion } from '@rubenchodev/materix-react/components/accordion';

export const title = { en: 'From details', es: 'Desde details' };
export const description = {
  en: '`component="details"` renders a native `<details>`/`<summary>` that works before hydration. `defaultExpanded` sets `open`, and find-in-page (Ctrl+F) opens the panel that contains the match.',
  es: '`component="details"` renderiza un `<details>`/`<summary>` nativo que funciona antes de hidratar. `defaultExpanded` fija `open` y la búsqueda en página (Ctrl+F) abre el panel que contiene la coincidencia.',
};

export default function Demo() {
  return (
    <div className="demo-wide">
      <Accordion component="details" summary="¿Funciona sin JavaScript?" defaultExpanded>
        <p>Sí. El elemento nativo se abre y se cierra por sí solo; Materix añade el aspecto, la transición y el soporte de teclado.</p>
      </Accordion>
      <Accordion component="details" summary="¿La búsqueda del navegador encuentra el texto oculto?">
        <p>Sí: los paneles cerrados se abren cuando Ctrl+F encuentra una coincidencia en su interior.</p>
      </Accordion>
    </div>
  );
}
