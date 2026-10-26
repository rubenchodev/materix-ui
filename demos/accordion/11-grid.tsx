import { Accordion, AccordionGroup } from '@rubenchodev/materix-react/components/accordion';
import { Grid } from '@rubenchodev/materix-react/components/grid';

export const title = { en: 'Grid layout', es: 'Maquetación en grilla' };
export const description = {
  en: 'Accordion groups adapt to the `Grid` columns: one column on mobile, two from 900px.',
  es: 'Los grupos de acordeones se adaptan a las columnas de `Grid`: una columna en móvil y dos desde 900px.',
};

export default function Demo() {
  return (
    <Grid container spacing={2} className="mtx-w-100">
      <Grid size={{ xs: 12, md: 6 }}>
        <AccordionGroup>
          <Accordion summary="Shipping" defaultExpanded>
            Free shipping on orders over $50.
          </Accordion>
          <Accordion summary="Return policy">30 days to return your order.</Accordion>
        </AccordionGroup>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <AccordionGroup variant="outlined">
          <Accordion summary="Warranty">Two-year manufacturer warranty.</Accordion>
          <Accordion summary="Support">Chat and email, Monday to Friday.</Accordion>
        </AccordionGroup>
      </Grid>
    </Grid>
  );
}
