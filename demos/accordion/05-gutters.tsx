import { Accordion } from '@rubenchodev/materix-react/components/accordion';

export const title = { en: 'Gutters', es: 'Márgenes (gutters)' };
export const description = {
  en: 'When expanded, the panel gains a 16px vertical margin and the summary grows from 48px to 64px. `disableGutters` keeps 48px and removes the margin, useful in dense lists.',
  es: 'Al expandirse, el panel gana un margen vertical de 16px y el resumen crece de 48px a 64px. `disableGutters` mantiene 48px y quita el margen, útil en listas densas.',
};

export default function Demo() {
  return (
    <div className="demo-grid-2 mtx-w-100">
      <div>
        <Accordion summary="First">Collapsed panel.</Accordion>
        <Accordion summary="Second (expanded)" defaultExpanded>
          16px apart above and below.
        </Accordion>
        <Accordion summary="Third">Collapsed panel.</Accordion>
      </div>
      <div>
        <Accordion disableGutters summary="First · no gutters">
          Collapsed panel.
        </Accordion>
        <Accordion disableGutters summary="Second (expanded) · no gutters" defaultExpanded>
          No margin and no height change.
        </Accordion>
        <Accordion disableGutters summary="Third · no gutters">
          Collapsed panel.
        </Accordion>
      </div>
    </div>
  );
}
