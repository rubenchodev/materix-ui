import { Divider } from '@rubenchodev/materix-react/components/divider';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';

export const title = { en: 'Vertical orientation', es: 'Orientación vertical' };
export const description = {
  en: '`orientation="vertical"` creates a line that stretches to the height of its flex row. It renders a `<div>` with `role="separator"` and `aria-orientation="vertical"` (like MUI).',
  es: '`orientation="vertical"` crea una línea que se estira a la altura de su fila flex. Renderiza un `<div>` con `role="separator"` y `aria-orientation="vertical"` (como MUI).',
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">Entre botones de icono</span>
        <div className="demo-row" role="toolbar" aria-label="Formato de texto">
          <IconButton icon="format_bold" aria-label="Negrita" />
          <IconButton icon="format_italic" aria-label="Cursiva" />
          <Divider orientation="vertical" flexItem />
          <IconButton icon="format_align_left" aria-label="Alinear a la izquierda" />
          <IconButton icon="format_align_center" aria-label="Centrar" />
          <IconButton icon="format_align_right" aria-label="Alinear a la derecha" />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Entre texto</span>
        <div className="demo-row">
          <span>Inicio</span>
          <Divider orientation="vertical" />
          <span>Productos</span>
          <Divider orientation="vertical" />
          <span>Contacto</span>
        </div>
      </div>
    </div>
  );
}
