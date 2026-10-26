import { ToggleButton, ToggleButtonGroup } from '@rubenchodev/materix-react/components/toggle-button';

export const title = { en: 'Exclusive and multiple selection', es: 'Selección exclusiva y múltiple' };
export const description = {
  en: "With `exclusive` only one button is active and the value is a `string` or `null`; without it the selection is multiple and the value is a `string[]` in DOM order.",
  es: "Con `exclusive` solo un botón está activo y el valor es un `string` o `null`; sin él la selección es múltiple y el valor es un `string[]` en orden del DOM.",
};

export default function Demo() {
  return (
    <div className="demo-row">
      <div className="demo-group">
        <span className="demo-label">exclusive</span>
        <ToggleButtonGroup exclusive defaultValue="center" aria-label="Alineación">
          <ToggleButton value="left" icon="format_align_left" aria-label="Izquierda" />
          <ToggleButton value="center" icon="format_align_center" aria-label="Centro" />
          <ToggleButton value="right" icon="format_align_right" aria-label="Derecha" />
        </ToggleButtonGroup>
      </div>
      <div className="demo-group">
        <span className="demo-label">multiple</span>
        <ToggleButtonGroup defaultValue={['bold', 'italic']} aria-label="Formato de texto">
          <ToggleButton value="bold" icon="format_bold" aria-label="Negrita" />
          <ToggleButton value="italic" icon="format_italic" aria-label="Cursiva" />
          <ToggleButton value="underlined" icon="format_underlined" aria-label="Subrayado" />
          <ToggleButton value="color" icon="format_color_fill" aria-label="Color de relleno" />
        </ToggleButtonGroup>
      </div>
    </div>
  );
}
