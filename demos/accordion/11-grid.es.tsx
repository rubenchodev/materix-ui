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
          <Accordion summary="Envío" defaultExpanded>
            Envío gratuito en pedidos superiores a 50 $.
          </Accordion>
          <Accordion summary="Política de devoluciones">30 días para devolver tu pedido.</Accordion>
        </AccordionGroup>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <AccordionGroup variant="outlined">
          <Accordion summary="Garantía">Dos años de garantía del fabricante.</Accordion>
          <Accordion summary="Soporte">Chat y correo electrónico, de lunes a viernes.</Accordion>
        </AccordionGroup>
      </Grid>
    </Grid>
  );
}
