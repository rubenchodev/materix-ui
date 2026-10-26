import { Rating } from '@rubenchodev/materix-react/components/rating';

export const title = { en: 'Sizes', es: 'Tamaños' };
export const description = {
  en: "MUI sizes through `size`: small 18px, medium 24px (default) and large 30px. The built-in icons are SVG and scale without losing sharpness.",
  es: "Tamaños MUI con `size`: small 18px, medium 24px (por defecto) y large 30px. Los iconos incluidos son SVG y escalan sin perder nitidez.",
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">Large · 30px</span>
        <Rating defaultValue={4} size="large" aria-label="Grande" />
      </div>
      <div className="demo-group">
        <span className="demo-label">Medium · 24px (por defecto)</span>
        <Rating defaultValue={4} aria-label="Mediano" />
      </div>
      <div className="demo-group">
        <span className="demo-label">Small · 18px</span>
        <Rating defaultValue={4} size="small" aria-label="Pequeño" />
      </div>
    </div>
  );
}
