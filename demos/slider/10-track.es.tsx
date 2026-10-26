import { Slider } from '@rubenchodev/materix-react/components/slider';

export const title = { en: 'Track', es: 'Track' };
export const description = {
  en: "track is normal (default), inverted (highlights the part after the value) or false (no track, useful with marks).",
  es: "track es normal (por defecto), inverted (resalta la parte posterior al valor) o false (sin track, útil con marcas).",
};

export default function Demo() {
  return (
    <div className="demo-stack demo-wide mtx-px-4">
      <div className="demo-group">
        <span className="demo-label">Invertido</span>
        <Slider aria-label="Track invertido" track="inverted" marks="0:0,25:25,50:50,75:75,100:100" defaultValue={30} />
      </div>
      <div className="demo-group">
        <span className="demo-label">Rango invertido</span>
        <Slider aria-label="Rango invertido" track="inverted" defaultValue={[20, 37]} />
      </div>
      <div className="demo-group">
        <span className="demo-label">Sin track</span>
        <Slider aria-label="Sin track" track={false} marks="0:0 °C,20:20 °C,37:37 °C,100:100 °C" defaultValue={37} />
      </div>
    </div>
  );
}
