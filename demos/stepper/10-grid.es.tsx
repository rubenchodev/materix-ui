import { Grid } from '@rubenchodev/materix-react/components/grid';
import { Step, Stepper } from '@rubenchodev/materix-react/components/stepper';

export const title = { en: 'Grid', es: 'Grilla' };
export const description = {
  en: "Inside `Grid` the stepper takes its column width; narrow columns work best with the alternative label or vertical orientation.",
  es: "Dentro de `Grid` el stepper toma el ancho de su columna; en columnas estrechas conviene la etiqueta alternativa o la orientación vertical.",
};

export default function Demo() {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Stepper
          alternativeLabel
          defaultActiveStep={2}
          label="Envío"
          steps={['Preparando', 'Enviado', 'En reparto', 'Entregado']}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Stepper orientation="vertical" defaultActiveStep={1} label="Ticket de soporte">
          <Step label="Recibido" />
          <Step label="En revisión">
            <p>Un agente está revisando tu caso.</p>
          </Step>
          <Step label="Resuelto" />
        </Stepper>
      </Grid>
    </Grid>
  );
}
