import { Grid } from '@rubenchodev/materix-react/components/grid';
import { Slider } from '@rubenchodev/materix-react/components/slider';

export const title = { en: 'Grid', es: 'Grilla' };
export const description = {
  en: "In a Grid each slider fills its column: one on mobile, two from 600px and three from 900px.",
  es: "En un Grid cada slider ocupa su columna: una en móvil, dos desde 600px y tres desde 900px.",
};

const CHANNELS: Array<[string, number]> = [
  ['Bass', 40],
  ['Mid', 55],
  ['Treble', 70],
  ['Balance', 50],
  ['Reverb', 20],
  ['Gain', 65],
];

export default function Demo() {
  return (
    <Grid container spacing={2}>
      {CHANNELS.map(([label, value]) => (
        <Grid key={label} size={{ xs: 12, sm: 6, md: 4 }}>
          <div className="demo-group">
            <span className="demo-label">{label}</span>
            <Slider aria-label={label} defaultValue={value} size="small" valueLabelDisplay="auto" />
          </div>
        </Grid>
      ))}
    </Grid>
  );
}
