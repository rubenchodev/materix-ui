import { NativeSelect } from '@rubenchodev/materix-react/components/native-select';
import { TextField } from '@rubenchodev/materix-react/components/text-field';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Grid } from '@rubenchodev/materix-react/components/grid';

export const title = { en: 'Real-world examples', es: 'Casos de uso reales' };
export const description = {
  en: 'A quick address form on mobile: the system picker appears when each field is tapped, and the values are submitted with the form.',
  es: 'Un formulario rápido de dirección en móvil: al tocar cada campo aparece el selector del sistema y los valores se envían con el formulario.',
};

export default function Demo() {
  return (
    <form aria-label="Shipping address" onSubmit={(event) => event.preventDefault()}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <NativeSelect
            variant="outlined"
            label="Country"
            name="country"
            autoComplete="country"
            required
            options={[{ value: 'co', label: 'Colombia' }, { value: 'mx', label: 'Mexico' }, { value: 'es', label: 'Spain' }]}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <NativeSelect
            variant="outlined"
            label="Street type"
            name="street-type"
            options={[{ value: 'street', label: 'Street' }, { value: 'road', label: 'Road' }, { value: 'avenue', label: 'Avenue' }]}
          />
        </Grid>
        <Grid size={12}>
          <TextField variant="outlined" label="Address" name="address" autoComplete="street-address" fullWidth />
        </Grid>
        <Grid size={12}>
          <Button variant="contained" type="submit">Save address</Button>
        </Grid>
      </Grid>
    </form>
  );
}
