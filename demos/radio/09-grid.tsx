import { Grid } from '@rubenchodev/materix-react/components/grid';
import { Radio, RadioGroup } from '@rubenchodev/materix-react/components/radio';

export const title = { en: 'Grid', es: 'Grilla' };
export const description = {
  en: "With Grid the options of a single group are spread across responsive columns; they share the name, so they remain mutually exclusive and navigable with the arrow keys.",
  es: "Con Grid las opciones de un mismo grupo se reparten en columnas responsive; comparten el name, así que siguen siendo excluyentes y navegables con las flechas.",
};

const SLOTS = [
  ['08', '08:00 – 10:00'],
  ['10', '10:00 – 12:00'],
  ['16', '16:00 – 18:00'],
  ['18', '18:00 – 20:00'],
];

export default function Demo() {
  return (
    <RadioGroup aria-label="Time slot" defaultValue="10">
      <Grid container spacing={1}>
        {SLOTS.map(([value, label]) => (
          <Grid key={value} size={{ xs: 12, sm: 6, md: 3 }}>
            <Radio value={value} label={label} />
          </Grid>
        ))}
      </Grid>
    </RadioGroup>
  );
}
