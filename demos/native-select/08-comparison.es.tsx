import { NativeSelect } from '@rubenchodev/materix-react/components/native-select';
import { Select } from '@rubenchodev/materix-react/components/select';

export const title = { en: 'Select or NativeSelect?', es: '¿Select o NativeSelect?' };
export const description = {
  en: 'The same data with both components. NativeSelect opens the system menu; Select draws its own MUI menu with search, icons and multiple selection with checkboxes.',
  es: 'Los mismos datos con ambos componentes. NativeSelect abre el menú del sistema; Select dibuja su propio menú MUI con búsqueda, iconos y selección múltiple con casillas.',
};

const COUNTRIES = [
  { value: 'co', label: 'Colombia' },
  { value: 'mx', label: 'México' },
  { value: 'es', label: 'España' },
];

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">NativeSelect · menú del sistema</span>
        <NativeSelect variant="outlined" label="País" options={COUNTRIES} />
      </div>
      <div className="demo-group">
        <span className="demo-label">Select · menú MUI con búsqueda</span>
        <Select variant="outlined" label="País" search options={COUNTRIES} />
      </div>
    </div>
  );
}
