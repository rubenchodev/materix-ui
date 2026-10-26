import { Autocomplete } from '@rubenchodev/materix-react/components/autocomplete';
import { FILMS } from './data.es';

export const title = { en: 'Free solo', es: 'Valores libres (free solo)' };
export const description = {
  en: '`freeSolo` accepts values that are not in the list: Enter confirms the text (in single selection also when leaving the field). With no matching options, neither the popup nor the open button is shown.',
  es: '`freeSolo` acepta valores que no están en la lista: Enter confirma el texto (en selección única también al salir del campo). Sin opciones coincidentes no se muestran ni el popup ni el botón de abrir.',
};

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">Búsqueda libre</span>
        <Autocomplete label="Buscar" freeSolo startIcon="search" options={FILMS} />
      </div>
      <div className="demo-group">
        <span className="demo-label">Etiquetas libres (múltiple)</span>
        <Autocomplete label="Palabras clave" freeSolo multiple options={['materix', 'mui', 'vanilla']} defaultValue={['materix']} />
      </div>
    </div>
  );
}
