import { Checkbox } from '@rubenchodev/materix-react/components/checkbox';
import { Grid } from '@rubenchodev/materix-react/components/grid';

export const title = { en: 'Grid', es: 'Grilla' };
export const description = {
  en: "With Grid a long list of options is split into columns: one on mobile, two from 600px and three from 900px.",
  es: "Con Grid una lista larga de opciones se reparte en columnas: una en móvil, dos desde 600px y tres desde 900px.",
};

const DAYS: Array<[string, boolean]> = [
  ['Monday', true],
  ['Tuesday', true],
  ['Wednesday', true],
  ['Thursday', true],
  ['Friday', true],
  ['Saturday', false],
];

export default function Demo() {
  return (
    <Grid container spacing={1}>
      {DAYS.map(([day, checked]) => (
        <Grid key={day} size={{ xs: 12, sm: 6, md: 4 }}>
          <Checkbox label={day} defaultChecked={checked} />
        </Grid>
      ))}
    </Grid>
  );
}
