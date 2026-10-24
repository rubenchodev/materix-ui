import { Slider } from '@rubenchodev/materix-react/components/slider';
import type { SliderColor } from '@rubenchodev/materix-react/components/slider';

export const title = { en: 'Colors', es: 'Colores' };
export const description = {
  en: "color accepts the MUI palette: primary (default), secondary, error, warning, info and success.",
  es: "color acepta la paleta MUI: primary (por defecto), secondary, error, warning, info y success.",
};

const COLORS: SliderColor[] = ['primary', 'secondary', 'error', 'warning', 'info', 'success'];

export default function Demo() {
  return (
    <div className="demo-stack demo-wide">
      {COLORS.map((color) => (
        <Slider key={color} aria-label={color[0].toUpperCase() + color.slice(1)} color={color} defaultValue={60} />
      ))}
    </div>
  );
}
