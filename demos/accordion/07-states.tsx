import { Accordion } from '@rubenchodev/materix-react/components/accordion';

export const title = { en: 'States', es: 'Estados' };
export const description = {
  en: 'Keyboard focus paints the `action.focus` background. `disabled` dims the summary and blocks interaction; `ripple` enables the ripple (off by default, as in MUI) and `duration` fixes the animation time in ms.',
  es: 'El foco de teclado pinta el fondo `action.focus`. `disabled` atenúa el resumen y bloquea la interacción; `ripple` activa el ripple (desactivado por defecto, como en MUI) y `duration` fija la duración de la animación en ms.',
};

export default function Demo() {
  return (
    <div className="demo-wide">
      <Accordion summary="Normal">Enabled panel.</Accordion>
      <Accordion summary="Expanded" defaultExpanded>
        Initially expanded panel.
      </Accordion>
      <Accordion summary="With ripple" ripple>
        The summary shows the ripple when pressed.
      </Accordion>
      <Accordion summary="Slow animation (600 ms)" duration={600}>
        Fixed duration instead of the automatic one.
      </Accordion>
      <Accordion summary="Disabled" disabled>
        It cannot be opened.
      </Accordion>
    </div>
  );
}
