import { NativeSelect } from '@rubenchodev/materix-react/components/native-select';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: 'One `<NativeSelect>` with `label` and `<option>` children. As in MUI NativeSelect, the default variant is `standard`; the label is associated through `for`/`id`, so the select already has an accessible name. The list is drawn by the operating system.',
  es: 'Un único `<NativeSelect>` con `label` y children `<option>`. Como en NativeSelect de MUI, la variante predeterminada es `standard`; el label se asocia con `for`/`id`, así el select ya tiene nombre accesible. La lista la dibuja el sistema operativo.',
};

export default function Demo() {
  return (
    <div className="demo-fixed-width">
      <NativeSelect label="Edad" name="age" defaultValue="20">
        <option value="10">Diez</option>
        <option value="20">Veinte</option>
        <option value="30">Treinta</option>
      </NativeSelect>
    </div>
  );
}
