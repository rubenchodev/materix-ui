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
        <span className="demo-label">Search + actions · values format</span>
        <Select
          label="Skills"
          multiple
          search
          actionsBox
          selectAllText="Check all"
          deselectAllText="Uncheck all"
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
        <span className="demo-label">count format</span>
        <Select
          label="Languages"
          multiple
          selectedTextFormat="count"
          placeholder="Choose languages"
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
        <span className="demo-label">count &gt; 2 format</span>
        <Select label="Tags" multiple selectedTextFormat="count > 2" placeholder="No tags">
          <option value="new">New</option>
          <option value="sale">On sale</option>
          <option value="eco">Sustainable</option>
          <option value="top">Best seller</option>
        </Select>
      </div>
      <div className="demo-group">
        <span className="demo-label">static format + icons</span>
        <Select
          label="Visible columns"
          multiple
          selectedTextFormat="static"
          placeholder="Configure columns"
          defaultValue={['name', 'mail']}
          options={[
            { value: 'name', label: 'Name', icon: 'badge' },
            { value: 'mail', label: 'Email', icon: 'email' },
            { value: 'phone', label: 'Phone', icon: 'phone' },
          ]}
        />
      </div>
      <div className="demo-group">
        <span className="demo-label">Chips with renderValue</span>
        <Select
          label="Toppings"
          multiple
          placeholder="Pick toppings"
          defaultValue={['cheese', 'olives']}
          renderValue={(selected) => selected.map((option) => <Chip key={option.value} size="small" label={option.label} />)}
          options={[
            { value: 'cheese', label: 'Cheese' },
            { value: 'olives', label: 'Olives' },
            { value: 'basil', label: 'Basil' },
            { value: 'peppers', label: 'Peppers' },
          ]}
        />
      </div>
    </div>
  );
}
