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
      <Accordion summary="Términos del servicio" defaultExpanded>
        <p>Al continuar aceptas las condiciones de uso y la política de privacidad vigentes.</p>
        <AccordionActions>
          <Button variant="text">Cancelar</Button>
          <Button variant="text">Aceptar</Button>
        </AccordionActions>
      </Accordion>
    </div>
  );
}
