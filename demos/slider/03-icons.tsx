import { Slider } from '@rubenchodev/materix-react/components/slider';
import { Stack } from '@rubenchodev/materix-react/components/stack';

export const title = { en: 'With icons', es: 'Con iconos' };
export const description = {
  en: "The slider fills the available width, so decorative icons go next to it inside a horizontal Stack (MUI's \"Volume\" pattern).",
  es: "El slider ocupa el ancho disponible, así que los iconos decorativos van a su lado dentro de un Stack horizontal (patrón «Volume» de MUI).",
};

export default function Demo() {
  return (
    <div className="demo-stack demo-wide">
      <Stack direction="row" spacing={2} alignItems="center">
        <span className="material-icons" aria-hidden="true">volume_down</span>
        <Slider aria-label="Volume" defaultValue={60} />
        <span className="material-icons" aria-hidden="true">volume_up</span>
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center">
        <span className="material-icons" aria-hidden="true">brightness_low</span>
        <Slider aria-label="Brightness" size="small" color="secondary" defaultValue={40} />
        <span className="material-icons" aria-hidden="true">brightness_high</span>
      </Stack>
    </div>
  );
}
