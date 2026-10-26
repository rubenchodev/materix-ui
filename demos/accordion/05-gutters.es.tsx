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
        <Accordion summary="Primero">Panel cerrado.</Accordion>
        <Accordion summary="Segundo (expandido)" defaultExpanded>
          Se separa 16px arriba y abajo.
        </Accordion>
        <Accordion summary="Tercero">Panel cerrado.</Accordion>
      </div>
      <div>
        <Accordion disableGutters summary="Primero · sin márgenes">
          Panel cerrado.
        </Accordion>
        <Accordion disableGutters summary="Segundo (expandido) · sin márgenes" defaultExpanded>
          Sin margen ni cambio de altura.
        </Accordion>
        <Accordion disableGutters summary="Tercero · sin márgenes">
          Panel cerrado.
        </Accordion>
      </div>
    </div>
  );
}
