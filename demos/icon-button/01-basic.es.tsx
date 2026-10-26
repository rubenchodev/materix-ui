import { IconButton } from '@rubenchodev/materix-react/components/icon-button';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: 'Pass the Material Icons name in `icon`: the component renders the decorative 24px glyph and the centered ripple. The accessible name comes from `aria-label`.',
  es: 'Pasa el nombre de Material Icons en `icon`: el componente pinta el glifo decorativo de 24px y el ripple centrado. El nombre accesible sale de `aria-label`.',
};

export default function Demo() {
  return (
    <div className="demo-row">
      <IconButton icon="search" aria-label="Buscar" />
      <IconButton icon="favorite" color="error" aria-label="Añadir a favoritos" />
      <IconButton icon="share" color="primary" aria-label="Compartir" />
      <IconButton icon="delete" aria-label="Eliminar" />
    </div>
  );
}
