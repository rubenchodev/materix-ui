import { Slider } from '@rubenchodev/materix-react/components/slider';

export const title = { en: 'Marks', es: 'Marcas' };
export const description = {
  en: "marks adds a mark at every step; an array [{ value, label }] or the vanilla string \"0:0 °C,20:20 °C\" adds labelled marks. With step={null} the value can only land on a mark.",
  es: "marks añade una marca en cada step; un array [{ value, label }] o la cadena de vanilla \"0:0 °C,20:20 °C\" añade marcas con etiqueta. Con step={null} el valor solo puede caer en una marca.",
};

const TEMPERATURES = [
  { value: 0, label: '0 °C' },
  { value: 20, label: '20 °C' },
  { value: 37, label: '37 °C' },
  { value: 100, label: '100 °C' },
];

export default function Demo() {
  return (
    <div className="demo-stack demo-wide mtx-px-4">
      <div className="demo-group">
        <span className="demo-label">Una marca en cada step</span>
        <Slider aria-label="Pasos de 10" step={10} marks defaultValue={30} valueLabelDisplay="auto" />
      </div>
      <div className="demo-group">
        <span className="demo-label">Marcas con etiqueta (array)</span>
        <Slider
          aria-label="Temperatura con marcas"
          marks={TEMPERATURES}
          defaultValue={20}
          valueLabelDisplay="auto"
          valueLabelFormat="{value} °C"
        />
      </div>
      <div className="demo-group">
        <span className="demo-label">Marcas con etiqueta (sintaxis de cadena de vanilla)</span>
        <Slider aria-label="Temperatura con marcas en cadena" marks="0:0 °C,20:20 °C,37:37 °C,100:100 °C" defaultValue={50} />
      </div>
      <div className="demo-group">
        <span className="demo-label">Solo marcas (step = null)</span>
        <Slider
          aria-label="Temperatura restringida"
          step={null}
          marks={TEMPERATURES}
          defaultValue={37}
          valueLabelDisplay="auto"
          valueLabelFormat="{value} °C"
        />
      </div>
    </div>
  );
}
