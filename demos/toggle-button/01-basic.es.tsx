import { ToggleButton, ToggleButtonGroup } from '@rubenchodev/materix-react/components/toggle-button';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: "A `ToggleButtonGroup` with `ToggleButton` children: each button only needs `value` and, when icon-only, `icon` and `aria-label`. The group joins the borders and manages `aria-pressed`.",
  es: "Un `ToggleButtonGroup` con hijos `ToggleButton`: cada botón solo necesita `value` y, si es de solo icono, `icon` y `aria-label`. El grupo une los bordes y gestiona `aria-pressed`.",
};

export default function Demo() {
  return (
    <div className="demo-row">
      <ToggleButtonGroup exclusive defaultValue="left" aria-label="Alineación del texto">
        <ToggleButton value="left" icon="format_align_left" aria-label="Alinear a la izquierda" />
        <ToggleButton value="center" icon="format_align_center" aria-label="Centrar" />
        <ToggleButton value="right" icon="format_align_right" aria-label="Alinear a la derecha" />
        <ToggleButton value="justify" icon="format_align_justify" aria-label="Justificar" disabled />
      </ToggleButtonGroup>
    </div>
  );
}
