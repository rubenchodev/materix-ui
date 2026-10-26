import { Slider } from '@rubenchodev/materix-react/components/slider';

export const title = { en: 'Right-to-left', es: 'Derecha a izquierda' };
export const description = {
  en: "Inside dir=\"rtl\" the value grows from right to left, dragging follows the mirrored axis and ArrowLeft increases it.",
  es: "Dentro de dir=\"rtl\" el valor crece de derecha a izquierda, el arrastre sigue el eje invertido y la flecha izquierda lo incrementa.",
};

export default function Demo() {
  return (
    <div dir="rtl" className="demo-stack demo-wide mtx-px-4">
      <Slider aria-label="Slider RTL" marks="0:0,50:50,100:100" defaultValue={30} valueLabelDisplay="auto" />
      <Slider aria-label="Rango RTL" defaultValue={[20, 60]} valueLabelDisplay="auto" />
    </div>
  );
}
