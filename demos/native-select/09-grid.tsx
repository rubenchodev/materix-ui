import { NativeSelect } from '@rubenchodev/materix-react/components/native-select';
import { Grid } from '@rubenchodev/materix-react/components/grid';

export const title = { en: 'Grid', es: 'Grilla' };
export const description = {
  en: 'Inside a Grid each select takes the full width of its column: one per row on mobile, two from 600px and four from 900px.',
  es: 'Dentro de un Grid cada select ocupa todo el ancho de su columna: uno por fila en móvil, dos desde 600px y cuatro desde 900px.',
};

const FIELDS: Array<[string, string[]]> = [
  ['Year', ['2024', '2025', '2026']],
  ['Month', ['January', 'February', 'March']],
  ['Day', ['1', '2', '3']],
  ['Currency', ['USD', 'EUR', 'COP']],
];

export default function Demo() {
  return (
    <Grid container spacing={2}>
      {FIELDS.map(([label, values]) => (
        <Grid key={label} size={{ xs: 12, sm: 6, md: 3 }}>
          <NativeSelect
            variant="outlined"
            label={label}
            helperText={label === 'Currency' ? 'ISO 4217 code' : undefined}
            options={values.map((value) => ({ value, label: value }))}
          />
        </Grid>
      ))}
    </Grid>
  );
}
