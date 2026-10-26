import { Accordion, AccordionActions, AccordionDetails, AccordionSummary } from '@rubenchodev/materix-react/components/accordion';
import { Button } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'Composition with subcomponents', es: 'Composición con subcomponentes' };
export const description = {
  en: '`AccordionSummary`, `AccordionDetails` and `AccordionActions` give full control over each part (the vanilla BEM syntax). The icon of `AccordionSummary` overrides the Accordion one.',
  es: '`AccordionSummary`, `AccordionDetails` y `AccordionActions` dan control total sobre cada parte (la sintaxis BEM vanilla). El icono de `AccordionSummary` sustituye al del Accordion.',
};

export default function Demo() {
  return (
    <div className="demo-wide">
      <Accordion defaultExpanded>
        <AccordionSummary>Estructura completa</AccordionSummary>
        <AccordionDetails>
          AccordionSummary, AccordionDetails y AccordionActions dan control total sobre cada parte.
        </AccordionDetails>
        <AccordionActions>
          <Button variant="text">Cancelar</Button>
          <Button variant="text">Guardar</Button>
        </AccordionActions>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon="add_circle_outline">Resumen con icono propio</AccordionSummary>
        <AccordionDetails>El icono de AccordionSummary sustituye al del Accordion.</AccordionDetails>
      </Accordion>
    </div>
  );
}
