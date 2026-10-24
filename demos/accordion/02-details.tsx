import { Accordion } from '@rubenchodev/materix-react/components/accordion';

export const title = { en: 'From details', es: 'Desde details' };
export const description = {
  en: '`component="details"` renders a native `<details>`/`<summary>` that works before hydration. `defaultExpanded` sets `open`, and find-in-page (Ctrl+F) opens the panel that contains the match.',
  es: '`component="details"` renderiza un `<details>`/`<summary>` nativo que funciona antes de hidratar. `defaultExpanded` fija `open` y la búsqueda en página (Ctrl+F) abre el panel que contiene la coincidencia.',
};

export default function Demo() {
  return (
    <div className="demo-wide">
      <Accordion component="details" summary="Does it work without JavaScript?" defaultExpanded>
        <p>Yes. The native element opens and closes on its own; Materix adds the look, the transition and keyboard support.</p>
      </Accordion>
      <Accordion component="details" summary="Can the browser search find the hidden text?">
        <p>Yes: collapsed panels open when Ctrl+F finds a match inside them.</p>
      </Accordion>
    </div>
  );
}
