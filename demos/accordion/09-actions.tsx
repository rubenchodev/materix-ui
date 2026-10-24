import { Accordion, AccordionActions } from '@rubenchodev/materix-react/components/accordion';
import { Button } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'Actions', es: 'Acciones' };
export const description = {
  en: '`AccordionActions` goes at the bottom of the region, after the details, right-aligned with 8px between buttons; `disableSpacing` removes the spacing.',
  es: '`AccordionActions` va al pie de la región, tras los detalles, alineada a la derecha y con 8px entre botones; `disableSpacing` quita la separación.',
};

export default function Demo() {
  return (
    <div className="demo-wide">
      <Accordion summary="Terms of service" defaultExpanded>
        <p>By continuing you accept the current terms of use and privacy policy.</p>
        <AccordionActions>
          <Button variant="text">Cancel</Button>
          <Button variant="text">Agree</Button>
        </AccordionActions>
      </Accordion>
    </div>
  );
}
