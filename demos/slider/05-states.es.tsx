import { Slider } from '@rubenchodev/materix-react/components/slider';

export const title = { en: 'States', es: 'Estados' };
export const description = {
  en: "Hover shows an 8px halo, keyboard focus the same halo and dragging grows it to 14px. disabled paints the slider grey and blocks the pointer and the keyboard.",
  es: "El hover muestra un halo de 8px, el foco de teclado el mismo halo y al arrastrar crece a 14px. disabled pinta el slider en gris y bloquea puntero y teclado.",
};

export default function Demo() {
  return (
    <div className="demo-stack demo-wide">
      <div className="demo-group">
        <span className="demo-label">Habilitado (hover, foco y arrastre)</span>
        <Slider aria-label="Habilitado" defaultValue={35} valueLabelDisplay="auto" />
      </div>
      <div className="demo-group">
        <span className="demo-label">Deshabilitado</span>
        <Slider aria-label="Deshabilitado" defaultValue={35} disabled />
      </div>
      <div className="demo-group">
        <span className="demo-label">Rango deshabilitado</span>
        <Slider aria-label="Rango deshabilitado" defaultValue={[20, 70]} disabled />
      </div>
    </div>
  );
}
