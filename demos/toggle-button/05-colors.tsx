import { ToggleButton, ToggleButtonGroup } from '@rubenchodev/materix-react/components/toggle-button';
import type { ToggleButtonColor } from '@rubenchodev/materix-react/components/toggle-button';

export const title = { en: 'Colors', es: 'Colores' };
export const description = {
  en: "`color` colors the selected state: `standard` (primary text, default) or any palette color.",
  es: "`color` colorea el estado seleccionado: `standard` (texto primario, por defecto) o cualquier color de la paleta.",
};

const COLORS: ToggleButtonColor[] = ['standard', 'primary', 'secondary', 'error', 'warning', 'info', 'success'];

export default function Demo() {
  return (
    <div className="demo-grid-2">
      {COLORS.map((color) => (
        <div className="demo-group" key={color}>
          <span className="demo-label">{color}</span>
          <ToggleButtonGroup exclusive color={color} defaultValue="web" aria-label={`Platform (${color})`}>
            <ToggleButton value="web">Web</ToggleButton>
            <ToggleButton value="android">Android</ToggleButton>
            <ToggleButton value="ios">iOS</ToggleButton>
          </ToggleButtonGroup>
        </div>
      ))}
    </div>
  );
}
