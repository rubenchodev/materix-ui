import { Select } from '@rubenchodev/materix-react/components/select';
import { Chip } from '@rubenchodev/materix-react/components/chip';

export const title = { en: 'Multiple selection', es: 'Selección múltiple' };
export const description = {
  en: "With `multiple`, each option gets a checkbox and the menu stays open. `actionsBox` adds bulk actions, `selectedTextFormat` controls the text in the control and `renderValue` can draw chips.",
  es: "Con `multiple` cada opción lleva una casilla y el menú permanece abierto. `actionsBox` añade acciones masivas, `selectedTextFormat` controla el texto del control y `renderValue` permite pintar chips.",
};

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">Búsqueda + acciones · formato values</span>
        <Select
          label="Habilidades"
          multiple
          search
          actionsBox
          selectAllText="Marcar todo"
          deselectAllText="Desmarcar todo"
          defaultValue={['js', 'ts']}
          options={[
            { value: 'js', label: 'JavaScript' },
            { value: 'ts', label: 'TypeScript' },
            { value: 'html', label: 'HTML' },
            { value: 'css', label: 'CSS' },
            { value: 'py', label: 'Python' },
          ]}
        />
      </div>
      <div className="demo-group">
        <span className="demo-label">formato count</span>
        <Select
          label="Lenguajes"
          multiple
          selectedTextFormat="count"
          placeholder="Elige lenguajes"
          defaultValue={['js', 'go', 'rs']}
          options={[
            { value: 'js', label: 'JavaScript' },
            { value: 'go', label: 'Go' },
            { value: 'rs', label: 'Rust' },
            { value: 'kt', label: 'Kotlin' },
          ]}
        />
      </div>
      <div className="demo-group">
        <span className="demo-label">formato count &gt; 2</span>
        <Select label="Etiquetas" multiple selectedTextFormat="count > 2" placeholder="Sin etiquetas">
          <option value="new">Nuevo</option>
          <option value="sale">En oferta</option>
          <option value="eco">Sostenible</option>
          <option value="top">Más vendido</option>
        </Select>
      </div>
      <div className="demo-group">
        <span className="demo-label">formato static + iconos</span>
        <Select
          label="Columnas visibles"
          multiple
          selectedTextFormat="static"
          placeholder="Configurar columnas"
          defaultValue={['name', 'mail']}
          options={[
            { value: 'name', label: 'Nombre', icon: 'badge' },
            { value: 'mail', label: 'Correo', icon: 'email' },
            { value: 'phone', label: 'Teléfono', icon: 'phone' },
          ]}
        />
      </div>
      <div className="demo-group">
        <span className="demo-label">Chips con renderValue</span>
        <Select
          label="Ingredientes"
          multiple
          placeholder="Elige ingredientes"
          defaultValue={['cheese', 'olives']}
          renderValue={(selected) => selected.map((option) => <Chip key={option.value} size="small" label={option.label} />)}
          options={[
            { value: 'cheese', label: 'Queso' },
            { value: 'olives', label: 'Aceitunas' },
            { value: 'basil', label: 'Albahaca' },
            { value: 'peppers', label: 'Pimientos' },
          ]}
        />
      </div>
    </div>
  );
}
