import { Slider } from '@rubenchodev/materix-react/components/slider';

export const title = { en: 'Value label', es: 'Etiqueta de valor' };
export const description = {
  en: "valueLabelDisplay is off (default), auto (hover, focus and drag) or on. valueLabelFormat takes a {value} template, also used as aria-valuetext, or a function; getAriaValueText sets a different spoken text.",
  es: "valueLabelDisplay es off (por defecto), auto (hover, foco y arrastre) u on. valueLabelFormat acepta una plantilla {value}, que también se usa como aria-valuetext, o una función; getAriaValueText define otro texto hablado.",
};

export default function Demo() {
  return (
    <div className="demo-stack demo-wide">
      <div className="demo-group">
        <span className="demo-label">Auto (hover, foco y arrastre)</span>
        <div className="mtx-pt-5">
          <Slider aria-label="Etiqueta automática" defaultValue={30} valueLabelDisplay="auto" />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Siempre visible, formato con plantilla</span>
        <div className="mtx-pt-5">
          <Slider aria-label="Temperatura" min={-10} max={40} defaultValue={21} valueLabelDisplay="on" valueLabelFormat="{value} °C" />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Formato con función y getAriaValueText</span>
        <div className="mtx-pt-5">
          <Slider
            aria-label="Almacenamiento"
            min={0}
            max={10}
            defaultValue={4}
            valueLabelDisplay="on"
            valueLabelFormat={(value) => `${2 ** value}G`}
            getAriaValueText={(value) => `${2 ** value} gigabytes`}
          />
        </div>
      </div>
    </div>
  );
}
