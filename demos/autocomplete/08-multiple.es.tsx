import { Autocomplete } from '@rubenchodev/materix-react/components/autocomplete';
import { COUNTRIES, FILMS, SKILLS } from './data.es';

export const title = { en: 'Multiple with chips', es: 'Múltiple con chips' };
export const description = {
  en: '`multiple` shows each value as a deletable Chip (button, or Backspace with empty text; ← and → move between chips). `limitTags` limits the chips visible without focus; `disableCloseOnSelect` keeps the list open; `filterSelectedOptions` hides those already chosen.',
  es: '`multiple` muestra cada valor como un Chip eliminable (botón, o Retroceso con el texto vacío; ← y → se mueven entre chips). `limitTags` limita los chips visibles sin foco; `disableCloseOnSelect` mantiene la lista abierta; `filterSelectedOptions` oculta los ya elegidos.',
};

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">Básico</span>
        <Autocomplete label="Habilidades" multiple options={SKILLS} defaultValue={['js', 'node']} name="skills" />
      </div>
      <div className="demo-group">
        <span className="demo-label">limitTags = 2</span>
        <Autocomplete label="Países" multiple limitTags={2} options={COUNTRIES} defaultValue={['co', 'mx', 'pe', 'cl', 'ar']} />
      </div>
      <div className="demo-group">
        <span className="demo-label">Mantener abierta al seleccionar</span>
        <Autocomplete label="Películas" multiple disableCloseOnSelect options={FILMS} />
      </div>
      <div className="demo-group">
        <span className="demo-label">Ocultar seleccionadas · filled</span>
        <Autocomplete label="Etiquetas" variant="filled" multiple filterSelectedOptions options={SKILLS} defaultValue={['css']} />
      </div>
    </div>
  );
}
