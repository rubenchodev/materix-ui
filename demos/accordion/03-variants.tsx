import { Accordion } from '@rubenchodev/materix-react/components/accordion';
import type { AccordionProps } from '@rubenchodev/materix-react/components/accordion';

export const title = { en: 'Variants', es: 'Variantes' };
export const description = {
  en: 'Paper surface with elevation 1 by default. `variant="outlined"` uses a 1px border (adjacent borders merge), `elevation={0}` makes it flat and `square` removes the rounded corners.',
  es: 'Superficie Paper con elevación 1 por defecto. `variant="outlined"` usa un borde de 1px (los contiguos se fusionan), `elevation={0}` la deja plana y `square` quita las esquinas redondeadas.',
};

const groups: Array<{ label: string; props: Partial<AccordionProps>; text: string }> = [
  { label: 'Elevation', props: {}, text: 'Elevation 1 shadow.' },
  { label: 'Outlined', props: { variant: 'outlined' }, text: '1px border, no shadow.' },
  { label: 'Elevation 0', props: { elevation: 0 }, text: 'Flat surface.' },
  { label: 'Square', props: { square: true }, text: 'No rounded corners.' },
];

export default function Demo() {
  return (
    <div className="demo-grid-2 mtx-w-100">
      {groups.map(({ label, props, text }) => (
        <div key={label}>
          <Accordion {...props} summary={label}>
            {text}
          </Accordion>
          <Accordion {...props} summary="Returns">
            30 days to return your order.
          </Accordion>
        </div>
      ))}
    </div>
  );
}
