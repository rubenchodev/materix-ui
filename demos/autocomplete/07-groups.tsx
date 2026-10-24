import { Autocomplete } from '@rubenchodev/materix-react/components/autocomplete';
import { SKILLS } from './data';

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
  { id: 'America/Bogota', city: 'Bogota', offset: 'GMT-5', region: 'Americas' },
  { id: 'America/Mexico_City', city: 'Mexico City', offset: 'GMT-6', region: 'Americas' },
  { id: 'America/Lima', city: 'Lima', offset: 'GMT-5', region: 'Americas' },
  { id: 'America/Santiago', city: 'Santiago', offset: 'GMT-4', region: 'Americas' },
  { id: 'Europe/Madrid', city: 'Madrid', offset: 'GMT+1', region: 'Europe' },
  { id: 'Europe/Lisbon', city: 'Lisbon', offset: 'GMT+0', region: 'Europe' },
  { id: 'Europe/Paris', city: 'Paris', offset: 'unavailable', region: 'Europe', disabled: true },
  { id: 'Asia/Tokyo', city: 'Tokyo', offset: 'GMT+9', region: 'Asia' },
  { id: 'Asia/Seoul', city: 'Seoul', offset: 'GMT+9', region: 'Asia' },
];

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <Autocomplete
        label="Time zone"
        name="tz"
        options={ZONES}
        getOptionLabel={(zone) => `${zone.city} (${zone.offset})`}
        getOptionValue={(zone) => zone.id}
        groupBy={(zone) => zone.region}
      />
      <Autocomplete label="Technology" options={SKILLS} />
    </div>
  );
}
