import { IconButton } from '@rubenchodev/materix-react/components/icon-button';
import { Tooltip } from '@rubenchodev/materix-react/components/tooltip';

export const title = { en: 'With tooltip', es: 'Con tooltip' };
export const description = {
  en: 'An icon alone is not always self-explanatory: wrap the IconButton in a Tooltip to show its name on hover, keyboard focus or long press. Without `aria-label` the tooltip text becomes the accessible name; with one, the tooltip is linked as a description.',
  es: 'Un icono solo no siempre se explica por sí mismo: envuelve el IconButton en un Tooltip para mostrar su nombre al pasar el puntero, al enfocarlo con el teclado o con una pulsación larga. Sin `aria-label` el texto del tooltip pasa a ser el nombre accesible; si ya lo tiene, el tooltip se enlaza como descripción.',
};

export default function Demo() {
  return (
    <div className="demo-row">
      <Tooltip title="Eliminar">
        <IconButton icon="delete" />
      </Tooltip>
      <Tooltip title="Archivar (E)">
        <IconButton icon="archive" aria-label="Archivar" />
      </Tooltip>
      <Tooltip title="Más opciones" placement="top" arrow>
        <IconButton icon="more_vert" />
      </Tooltip>
    </div>
  );
}
