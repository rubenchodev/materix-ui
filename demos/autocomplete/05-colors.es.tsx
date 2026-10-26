import { Autocomplete } from '@rubenchodev/materix-react/components/autocomplete';
import { COUNTRIES } from './data.es';

export const title = { en: 'Colors', es: 'Colores' };
export const description = {
  en: '`color` changes the focus color of the field and the background of selected options: `primary`, `secondary`, `success`, `warning`, `info`.',
  es: '`color` cambia el color de foco del campo y el fondo de las opciones seleccionadas: `primary`, `secondary`, `success`, `warning`, `info`.',
};

export default function Demo() {
  return (
    <div className="demo-grid-3">
      <Autocomplete label="Primary" options={COUNTRIES} defaultValue="co" />
      <Autocomplete label="Secondary" color="secondary" options={COUNTRIES} defaultValue="co" />
      <Autocomplete label="Success" color="success" options={COUNTRIES} defaultValue="co" />
    </div>
  );
}
