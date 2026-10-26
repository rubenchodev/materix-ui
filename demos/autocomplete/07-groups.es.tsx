import { Autocomplete } from '@rubenchodev/materix-react/components/autocomplete';
import { SKILLS } from './data.es';

export const title = { en: 'Groups and disabled options', es: 'Grupos y opciones deshabilitadas' };
export const description = {
  en: '`group` on each option (or `groupBy`) shows a sticky subheader; consecutive options are grouped, as in MUI. `disabled` options are skipped with the keyboard.',
  es: '`group` en cada opción (o `groupBy`) muestra una cabecera fija; las opciones consecutivas se agrupan, como en MUI. Las opciones `disabled` se saltan con el teclado.',
};

interface Zone {
  id: string;
  city: string;
  offset: string;
  region: string;
  disabled?: boolean;
}

const ZONES: Zone[] = [
  { id: 'America/Bogota', city: 'Bogotá', offset: 'GMT-5', region: 'América' },
  { id: 'America/Mexico_City', city: 'Ciudad de México', offset: 'GMT-6', region: 'América' },
  { id: 'America/Lima', city: 'Lima', offset: 'GMT-5', region: 'América' },
  { id: 'America/Santiago', city: 'Santiago', offset: 'GMT-4', region: 'América' },
  { id: 'Europe/Madrid', city: 'Madrid', offset: 'GMT+1', region: 'Europa' },
  { id: 'Europe/Lisbon', city: 'Lisboa', offset: 'GMT+0', region: 'Europa' },
  { id: 'Europe/Paris', city: 'París', offset: 'no disponible', region: 'Europa', disabled: true },
  { id: 'Asia/Tokyo', city: 'Tokio', offset: 'GMT+9', region: 'Asia' },
  { id: 'Asia/Seoul', city: 'Seúl', offset: 'GMT+9', region: 'Asia' },
];

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <Autocomplete
        label="Zona horaria"
        name="tz"
        options={ZONES}
        getOptionLabel={(zone) => `${zone.city} (${zone.offset})`}
        getOptionValue={(zone) => zone.id}
        groupBy={(zone) => zone.region}
      />
      <Autocomplete label="Tecnología" options={SKILLS} />
    </div>
  );
}
