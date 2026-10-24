import type { FormEvent } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Grid } from '@rubenchodev/materix-react/components/grid';
import { TextField } from '@rubenchodev/materix-react/components/text-field';

export const title = { en: 'Grid', es: 'Grilla' };
export const description = {
  en: 'Sign-up form with `Grid` (`spacing` and `size` per breakpoint): one column on mobile and two or three on desktop.',
  es: 'Formulario de registro con `Grid` (`spacing` y `size` por breakpoint): una columna en móvil y dos o tres en escritorio.',
};

export default function Demo() {
  return (
    <div className="demo-surface">
      <form noValidate onSubmit={(event: FormEvent) => event.preventDefault()}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="First name" startIcon="person" autoComplete="given-name" required />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Last name" autoComplete="family-name" required />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField label="Email" startIcon="email" autoComplete="email" required type="email" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField label="Phone" mask="phone" startIcon="phone" autoComplete="tel" type="tel" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField label="ZIP code" mask="zip" autoComplete="postal-code" />
          </Grid>
          <Grid size={12}>
            <TextField label="About you" multiline maxChars={200} autoResize rows={2} />
          </Grid>
          <Grid size={12}>
            <div className="mtx-d-flex mtx-justify-content-end mtx-gap-1">
              <Button variant="text" type="reset">
                Cancel
              </Button>
              <Button variant="contained" type="submit">
                Create account
              </Button>
            </div>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
