import type { FormEvent } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Grid } from '@rubenchodev/materix-react/components/grid';
import { Select } from '@rubenchodev/materix-react/components/select';
import { TextField } from '@rubenchodev/materix-react/components/text-field';
import { DateRangePicker, DateTimePicker, TimePicker } from '@rubenchodev/materix-react/components/date-time-picker';

export const title = { en: 'Grid', es: 'Grilla' };
export const description = {
  en: 'A room booking form in `Grid` combining a date range, a time, a Select and a Button.',
  es: 'Un formulario de reserva de sala en `Grid` que combina un rango de fechas, una hora, un Select y un Button.',
};

export default function Demo() {
  return (
    <div className="demo-surface">
      <form onSubmit={(event: FormEvent) => event.preventDefault()}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <DateRangePicker label="Días" minDate="today" required name="days" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TimePicker label="Hora de inicio" ampm required name="start" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Select
              label="Duración"
              name="duration"
              options={[
                { value: '60', label: '1 hora' },
                { value: '120', label: '2 horas' },
                { value: '240', label: 'Medio día' },
              ]}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField label="Organizador" startIcon="person" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <DateTimePicker label="Recordatorio" helperText="Opcional" name="reminder" />
          </Grid>
          <Grid size={12}>
            <Button variant="contained" type="submit">
              Reservar
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
