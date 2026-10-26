import { Accordion } from '@rubenchodev/materix-react/components/accordion';
import type { AccordionProps } from '@rubenchodev/materix-react/components/accordion';

export const title = { en: 'Variants', es: 'Variantes' };
export const description = {
  en: 'Paper surface with elevation 1 by default. `variant="outlined"` uses a 1px border (adjacent borders merge), `elevation={0}` makes it flat and `square` removes the rounded corners.',
  es: 'Superficie Paper con elevación 1 por defecto. `variant="outlined"` usa un borde de 1px (los contiguos se fusionan), `elevation={0}` la deja plana y `square` quita las esquinas redondeadas.',
};

const groups: Array<{ label: string; props: Partial<AccordionProps>; text: string }> = [
  { label: 'Elevación', props: {}, text: 'Sombra de elevación 1.' },
  { label: 'Con borde', props: { variant: 'outlined' }, text: 'Borde de 1px sin sombra.' },
  { label: 'Elevación 0', props: { elevation: 0 }, text: 'Superficie plana.' },
  { label: 'Cuadrado', props: { square: true }, text: 'Sin esquinas redondeadas.' },
];

export default function Demo() {
  return (
    <div className="demo-grid-2 mtx-w-100">
      {groups.map(({ label, props, text }) => (
        <div key={label}>
          <Accordion {...props} summary={label}>
            {text}
          </Accordion>
          <Accordion {...props} summary={`Devoluciones · ${label}`}>
            30 días para devolver tu pedido.
          </Accordion>
        </div>
      ))}
    </div>
  );
}
