import { Slider } from '@rubenchodev/materix-react/components/slider';

export const title = { en: 'Sizes', es: 'Tamaños' };
export const description = {
  en: "Medium (4px rail, 20px thumb, default) and small (2px rail, 12px thumb without shadow) with size=\"small\".",
  es: "Medium (rail de 4px, thumb de 20px, por defecto) y small (rail de 2px, thumb de 12px sin sombra) con size=\"small\".",
};

export default function Demo() {
  return (
    <div className="demo-stack demo-wide">
      <div className="demo-group">
        <span className="demo-label">Medium (rail de 4px, thumb de 20px)</span>
        <Slider aria-label="Slider mediano" defaultValue={50} valueLabelDisplay="auto" />
      </div>
      <div className="demo-group">
        <span className="demo-label">Small (rail de 2px, thumb de 12px)</span>
        <Slider aria-label="Slider pequeño" size="small" defaultValue={50} valueLabelDisplay="auto" />
      </div>
    </div>
  );
}
