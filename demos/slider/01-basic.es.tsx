import { Slider } from '@rubenchodev/materix-react/components/slider';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: "One element is enough: <Slider> renders the rail, the track, the thumb with its hidden native <input type=\"range\"> and the value label. Name it with aria-label; name and value are submitted with the form.",
  es: "Basta un elemento: <Slider> genera el rail, el track, el thumb con su <input type=\"range\"> nativo oculto y el value label. Dale nombre con aria-label; name y value se envían con el formulario.",
};

export default function Demo() {
  return (
    <div className="demo-stack demo-wide">
      <Slider aria-label="Volumen" name="volume" defaultValue={30} />
    </div>
  );
}
