import { Select } from '@rubenchodev/materix-react/components/select';

export const title = { en: 'Groups and selection limit', es: 'Grupos y límite de selección' };
export const description = {
  en: "`<optgroup>` (or an item with `options`) is shown as a subheader; disabled options cannot be chosen and `maxOptions={2}` locks the rest once the limit is reached.",
  es: "`<optgroup>` (o un elemento con `options`) se muestra como subtítulo; las opciones deshabilitadas no se pueden elegir y `maxOptions={2}` bloquea el resto al alcanzar el límite.",
};

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <Select label="Stack (max. 2)" multiple maxOptions={2} defaultValue={['react']}>
        <optgroup label="Frontend">
          <option value="react">React</option>
          <option value="vue">Vue</option>
          <option value="angular" disabled>Angular (unavailable)</option>
        </optgroup>
        <optgroup label="Backend">
          <option value="node">Node.js</option>
          <option value="django">Django</option>
        </optgroup>
      </Select>
      <Select
        label="Time zone"
        search
        options={[
          { label: 'Americas', options: [{ value: 'bog', label: 'Bogotá (UTC−5)' }, { value: 'mex', label: 'Mexico City (UTC−6)' }] },
          { label: 'Europe', options: [{ value: 'mad', label: 'Madrid (UTC+1)' }, { value: 'lis', label: 'Lisbon (UTC+0)' }] },
        ]}
      />
    </div>
  );
}
