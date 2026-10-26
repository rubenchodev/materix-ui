import { Autocomplete } from '@rubenchodev/materix-react/components/autocomplete';
import { Grid } from '@rubenchodev/materix-react/components/grid';
import { COUNTRIES, SKILLS } from './data.es';

export const title = { en: 'Grid layout', es: 'Maquetación en grilla' };
export const description = {
  en: 'It takes 100% of its column in `Grid`.',
  es: 'Ocupa el 100% de su columna en `Grid`.',
};

export default function Demo() {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Autocomplete label="País" options={COUNTRIES} />
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <Autocomplete label="Habilidades" multiple options={SKILLS} defaultValue={['html', 'css', 'js']} />
      </Grid>
    </Grid>
  );
}
