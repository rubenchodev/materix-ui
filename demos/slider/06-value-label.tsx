import { Slider } from '@rubenchodev/materix-react/components/slider';

export const title = { en: 'Value label', es: 'Etiqueta de valor' };
export const description = {
  en: "valueLabelDisplay is off (default), auto (hover, focus and drag) or on. valueLabelFormat takes a {value} template, also used as aria-valuetext, or a function; getAriaValueText sets a different spoken text.",
  es: "valueLabelDisplay es off (por defecto), auto (hover, foco y arrastre) u on. valueLabelFormat acepta una plantilla {value}, que también se usa como aria-valuetext, o una función; getAriaValueText define otro texto hablado.",
};

export default function Demo() {
  return (
    <div className="demo-stack demo-wide">
      <div className="demo-group mtx-pt-5">
        <span className="demo-label">Auto (hover, focus and drag)</span>
        <Slider aria-label="Auto label" defaultValue={30} valueLabelDisplay="auto" />
      </div>
      <div className="demo-group mtx-pt-5">
        <span className="demo-label">Always on, template format</span>
        <Slider aria-label="Temperature" min={-10} max={40} defaultValue={21} valueLabelDisplay="on" valueLabelFormat="{value} °C" />
      </div>
      <div className="demo-group mtx-pt-5">
        <span className="demo-label">Function format and getAriaValueText</span>
        <Slider
          aria-label="Storage"
          min={0}
          max={10}
          defaultValue={4}
          valueLabelDisplay="on"
          valueLabelFormat={(value) => `${2 ** value}G`}
          getAriaValueText={(value) => `${2 ** value} gigabytes`}
        />
      </div>
    </div>
  );
}
