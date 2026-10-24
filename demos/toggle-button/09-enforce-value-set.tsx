import { ToggleButton, ToggleButtonGroup } from '@rubenchodev/materix-react/components/toggle-button';

export const title = { en: 'Enforce value set', es: 'Valor siempre definido' };
export const description = {
  en: "`enforceValueSet` prevents deselecting the last active button, in exclusive and multiple mode.",
  es: "`enforceValueSet` impide deseleccionar el último botón activo, en modo exclusivo y múltiple.",
};

export default function Demo() {
  return (
    <div className="demo-row">
      <ToggleButtonGroup exclusive enforceValueSet defaultValue="left" aria-label="Required alignment">
        <ToggleButton value="left" icon="format_align_left" aria-label="Left" />
        <ToggleButton value="center" icon="format_align_center" aria-label="Center" />
        <ToggleButton value="right" icon="format_align_right" aria-label="Right" />
      </ToggleButtonGroup>
      <ToggleButtonGroup enforceValueSet defaultValue={['bold']} aria-label="At least one format">
        <ToggleButton value="bold" icon="format_bold" aria-label="Bold" />
        <ToggleButton value="italic" icon="format_italic" aria-label="Italic" />
        <ToggleButton value="underlined" icon="format_underlined" aria-label="Underline" />
      </ToggleButtonGroup>
    </div>
  );
}
