import { Accordion } from '@rubenchodev/materix-react/components/accordion';

export const title = { en: 'States', es: 'Estados' };
export const description = {
  en: 'Keyboard focus paints the `action.focus` background. `disabled` dims the summary and blocks interaction; `ripple` enables the ripple (off by default, as in MUI) and `duration` fixes the animation time in ms.',
  es: 'El foco de teclado pinta el fondo `action.focus`. `disabled` atenúa el resumen y bloquea la interacción; `ripple` activa el ripple (desactivado por defecto, como en MUI) y `duration` fija la duración de la animación en ms.',
};

export default function Demo() {
  return (
    <div className="demo-wide">
      <Accordion summary="Normal">Panel habilitado.</Accordion>
      <Accordion summary="Expandido" defaultExpanded>
        Panel expandido inicialmente.
      </Accordion>
      <Accordion summary="Con ripple" ripple>
        El resumen muestra la onda al pulsar.
      </Accordion>
      <Accordion summary="Animación lenta (600 ms)" duration={600}>
        Duración fija en lugar de la automática.
      </Accordion>
      <Accordion summary="Deshabilitado" disabled>
        No se puede abrir.
      </Accordion>
    </div>
  );
}
