import { Slider } from '@rubenchodev/materix-react/components/slider';

export const title = { en: 'Vertical', es: 'Vertical' };
export const description = {
  en: "orientation=\"vertical\" grows from bottom to top (200px, --mtx-slider-vertical-length) and sets aria-orientation=\"vertical\" on the input.",
  es: "orientation=\"vertical\" crece de abajo arriba (200px, --mtx-slider-vertical-length) y añade aria-orientation=\"vertical\" al input.",
};

export default function Demo() {
  return (
    <div className="demo-row demo-row--start mtx-gap-5 mtx-pl-4">
      <Slider aria-label="Vertical" orientation="vertical" defaultValue={30} valueLabelDisplay="auto" />
      <Slider aria-label="Rango vertical" orientation="vertical" defaultValue={[20, 70]} valueLabelDisplay="auto" />
      <Slider
        aria-label="Temperatura vertical"
        orientation="vertical"
        color="secondary"
        marks="0:0 °C,20:20 °C,37:37 °C,100:100 °C"
        defaultValue={37}
      />
      <Slider aria-label="Vertical pequeño" orientation="vertical" size="small" defaultValue={60} />
    </div>
  );
}
