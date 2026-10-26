import { Autocomplete } from '@rubenchodev/materix-react/components/autocomplete';
import { COUNTRIES } from './data.es';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: "A single `Autocomplete` with `label` and `options`. Type to filter (case- and accent-insensitive). The value (the option's `value`) is submitted in a hidden input with the `name`.",
  es: 'Un único `Autocomplete` con `label` y `options`. Escribe para filtrar (sin distinguir mayúsculas ni tildes). El valor (el `value` de la opción) se envía en un input oculto con el `name`.',
};

export default function Demo() {
  return (
    <div className="demo-fixed-width">
      <Autocomplete label="País" options={COUNTRIES} name="country" />
    </div>
  );
}
