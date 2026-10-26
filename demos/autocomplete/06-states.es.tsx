import { Autocomplete } from '@rubenchodev/materix-react/components/autocomplete';
import { COUNTRIES, SKILLS } from './data.es';

export const title = { en: 'States', es: 'Estados' };
export const description = {
  en: 'Hover to see the clear button; press Tab for focus. `disabled`, `readOnly`, `required`, `error` with `helperText` and `loading`.',
  es: 'Pasa el ratón para ver el botón de limpiar; pulsa Tab para el foco. `disabled`, `readOnly`, `required`, `error` con `helperText` y `loading`.',
};

export default function Demo() {
  return (
    <div className="demo-grid-3">
      <div className="demo-group">
        <span className="demo-label">Normal con ayuda</span>
        <Autocomplete label="País" options={COUNTRIES} helperText="Escribe para filtrar" />
      </div>
      <div className="demo-group">
        <span className="demo-label">Deshabilitado</span>
        <Autocomplete label="País" options={COUNTRIES} defaultValue="co" disabled />
      </div>
      <div className="demo-group">
        <span className="demo-label">Solo lectura</span>
        <Autocomplete label="País" options={COUNTRIES} defaultValue="mx" readOnly />
      </div>
      <div className="demo-group">
        <span className="demo-label">Error + ayuda</span>
        <Autocomplete label="País" options={COUNTRIES} error helperText="Elige un país de la lista" />
      </div>
      <div className="demo-group">
        <span className="demo-label">Requerido</span>
        <Autocomplete label="País" options={COUNTRIES} required />
      </div>
      <div className="demo-group">
        <span className="demo-label">Cargando</span>
        <Autocomplete label="Usuarios" options={[]} loading />
      </div>
      <div className="demo-group">
        <span className="demo-label">Múltiple deshabilitado</span>
        <Autocomplete label="Habilidades" multiple options={SKILLS} defaultValue={['js', 'python']} disabled />
      </div>
      <div className="demo-group">
        <span className="demo-label">Múltiple solo lectura</span>
        <Autocomplete label="Habilidades" multiple options={SKILLS} defaultValue={['ts', 'pg']} readOnly />
      </div>
      <div className="demo-group">
        <span className="demo-label">Sin opciones</span>
        <Autocomplete label="Vacío" options={[]} noOptionsText="Aún no hay nada" />
      </div>
    </div>
  );
}
