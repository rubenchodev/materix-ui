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
        <span className="demo-label">Between icon buttons</span>
        <div className="demo-row" role="toolbar" aria-label="Text formatting">
          <IconButton icon="format_bold" aria-label="Bold" />
          <IconButton icon="format_italic" aria-label="Italic" />
          <Divider orientation="vertical" flexItem />
          <IconButton icon="format_align_left" aria-label="Align left" />
          <IconButton icon="format_align_center" aria-label="Center" />
          <IconButton icon="format_align_right" aria-label="Align right" />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Between text</span>
        <div className="demo-row">
          <span>Home</span>
          <Divider orientation="vertical" />
          <span>Products</span>
          <Divider orientation="vertical" />
          <span>Contact</span>
        </div>
      </div>
    </div>
  );
}
