import { Slider } from '@rubenchodev/materix-react/components/slider';

export const title = { en: 'Range slider', es: 'Rango' };
export const description = {
  en: "An array value creates two thumbs submitted as {name}-start and {name}-end and named \"Minimum\" / \"Maximum\". Crossing thumbs swap; disableSwap blocks them and minDistance keeps a gap.",
  es: "Un valor array crea dos thumbs que se envían como {name}-start y {name}-end y se llaman «Mínimo» / «Máximo». Al cruzarse se intercambian; disableSwap los bloquea y minDistance mantiene una distancia.",
};

export default function Demo() {
  return (
    <div className="demo-stack demo-wide">
      <div className="demo-group">
        <span className="demo-label">Swap when crossing (default)</span>
        <Slider aria-label="Price" name="price" defaultValue={[20, 60]} valueLabelDisplay="auto" />
      </div>
      <div className="demo-group">
        <span className="demo-label">disableSwap</span>
        <Slider aria-label="No swap" defaultValue={[30, 50]} disableSwap valueLabelDisplay="auto" />
      </div>
      <div className="demo-group">
        <span className="demo-label">minDistance = 10</span>
        <Slider aria-label="Minimum distance" defaultValue={[30, 50]} minDistance={10} valueLabelDisplay="auto" />
      </div>
    </div>
  );
}
