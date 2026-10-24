import { Autocomplete } from '@rubenchodev/materix-react/components/autocomplete';
import { FILMS } from './data';

export const title = { en: 'With and without icons', es: 'Con y sin iconos' };
export const description = {
  en: '`startIcon` adds a start icon (the label lines up with the text). On each option, `icon` shows an icon and `description` a secondary text. The trailing button is the popup indicator (no configuration needed).',
  es: '`startIcon` añade un icono inicial (el label se alinea con el texto). En cada opción, `icon` muestra un icono y `description` un texto secundario. El botón final es el indicador del popup (sin configuración).',
};

const ACTIONS = [
  { value: 'edit', label: 'Edit', icon: 'edit', description: 'Modifies the document' },
  { value: 'share', label: 'Share', icon: 'share', description: 'Sends a link' },
  { value: 'archive', label: 'Archive', icon: 'archive', description: 'Hides it from the inbox' },
  { value: 'delete', label: 'Delete', icon: 'delete', description: 'Cannot be undone' },
];

export default function Demo() {
  return (
    <div className="demo-grid-3">
      <div className="demo-group">
        <span className="demo-label">No icon</span>
        <Autocomplete label="City" options={['New York', 'Los Angeles', 'Chicago', 'Houston', 'San Francisco']} />
      </div>
      <div className="demo-group">
        <span className="demo-label">With start icon</span>
        <Autocomplete label="Search movies" startIcon="search" options={FILMS} />
      </div>
      <div className="demo-group">
        <span className="demo-label">Options with icon and description</span>
        <Autocomplete label="Action" options={ACTIONS} />
      </div>
    </div>
  );
}
