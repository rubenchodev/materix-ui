import { Grid } from '@rubenchodev/materix-react/components/grid';
import { Switch } from '@rubenchodev/materix-react/components/switch';

export const title = { en: 'Grid', es: 'Grilla' };
export const description = {
  en: "In a Grid the switches are spread across columns: one on mobile, two from 600px and three from 900px.",
  es: "En un Grid los interruptores se reparten en columnas: una en móvil, dos desde 600px y tres desde 900px.",
};

const PERMISSIONS: Array<[string, boolean]> = [
  ['Location', true],
  ['Camera', false],
  ['Microphone', false],
  ['Contacts', true],
  ['Calendar', false],
  ['Storage', true],
];

export default function Demo() {
  return (
    <Grid container spacing={2}>
      {PERMISSIONS.map(([name, checked]) => (
        <Grid key={name} size={{ xs: 12, sm: 6, md: 4 }}>
          <Switch label={name} defaultChecked={checked} />
        </Grid>
      ))}
    </Grid>
  );
}
