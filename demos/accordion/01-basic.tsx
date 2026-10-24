import { Accordion } from '@rubenchodev/materix-react/components/accordion';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: '`summary` is the summary text and the children become the details (the vanilla single-element syntax). It renders the `<h3>`, the button with `aria-expanded`/`aria-controls`, the icon and the collapsible region. Adjacent panels share 1px separators and only the first and last get rounded corners.',
  es: '`summary` es el texto del resumen y los hijos pasan a ser los detalles (la sintaxis simplificada vanilla). Genera el `<h3>`, el botón con `aria-expanded`/`aria-controls`, el icono y la región plegable. Los paneles contiguos comparten separadores de 1px y solo el primero y el último llevan esquinas redondeadas.',
};

export default function Demo() {
  return (
    <div className="demo-wide">
      <Accordion summary="Accordion 1">Adjacent panels share 1px separators, just like MUI.</Accordion>
      <Accordion summary="Accordion 2">When expanded, the panel moves 16px away from its neighbors.</Accordion>
      <Accordion summary="Accordion 3" defaultExpanded>
        This panel starts expanded with defaultExpanded.
      </Accordion>
    </div>
  );
}
