import { Autocomplete } from '@rubenchodev/materix-react/components/autocomplete';
import { FILMS } from './data.es';

export const title = { en: 'With and without icons', es: 'Con y sin iconos' };
export const description = {
  en: '`startIcon` adds a start icon (the label lines up with the text). On each option, `icon` shows an icon and `description` a secondary text. The trailing button is the popup indicator (no configuration needed).',
  es: '`startIcon` añade un icono inicial (el label se alinea con el texto). En cada opción, `icon` muestra un icono y `description` un texto secundario. El botón final es el indicador del popup (sin configuración).',
};

const ACTIONS = [
  { value: 'edit', label: 'Editar', icon: 'edit', description: 'Modifica el documento' },
  { value: 'share', label: 'Compartir', icon: 'share', description: 'Envía un enlace' },
  { value: 'archive', label: 'Archivar', icon: 'archive', description: 'Lo oculta de la bandeja' },
  { value: 'delete', label: 'Eliminar', icon: 'delete', description: 'No se puede deshacer' },
];

export default function Demo() {
  return (
    <div className="demo-grid-3">
      <div className="demo-group">
        <span className="demo-label">Sin icono</span>
        <Autocomplete label="Ciudad" options={['Bogotá', 'Lima', 'Madrid', 'Ciudad de México', 'Santiago']} />
      </div>
      <div className="demo-group">
        <span className="demo-label">Con icono inicial</span>
        <Autocomplete label="Buscar película" startIcon="search" options={FILMS} />
      </div>
      <div className="demo-group">
        <span className="demo-label">Opciones con icono y descripción</span>
        <Autocomplete label="Acción" options={ACTIONS} />
      </div>
    </div>
  );
}
