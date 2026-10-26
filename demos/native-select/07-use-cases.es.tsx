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
    <form aria-label="Dirección de envío" onSubmit={(event) => event.preventDefault()}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <NativeSelect
            variant="outlined"
            label="País"
            name="country"
            autoComplete="country"
            required
            options={[{ value: 'co', label: 'Colombia' }, { value: 'mx', label: 'México' }, { value: 'es', label: 'España' }]}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <NativeSelect
            variant="outlined"
            label="Tipo de vía"
            name="street-type"
            options={[{ value: 'street', label: 'Calle' }, { value: 'road', label: 'Carrera' }, { value: 'avenue', label: 'Avenida' }]}
          />
        </Grid>
        <Grid size={12}>
          <TextField variant="outlined" label="Dirección" name="address" autoComplete="street-address" fullWidth />
        </Grid>
        <Grid size={12}>
          <Button variant="contained" type="submit">Guardar dirección</Button>
        </Grid>
      </Grid>
    </form>
  );
}
