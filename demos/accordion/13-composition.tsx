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
        <AccordionSummary>Full structure</AccordionSummary>
        <AccordionDetails>
          AccordionSummary, AccordionDetails and AccordionActions give full control over each part.
        </AccordionDetails>
        <AccordionActions>
          <Button variant="text">Cancel</Button>
          <Button variant="text">Save</Button>
        </AccordionActions>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon="add_circle_outline">Summary with its own icon</AccordionSummary>
        <AccordionDetails>The icon of AccordionSummary overrides the Accordion one.</AccordionDetails>
      </Accordion>
    </div>
  );
}
