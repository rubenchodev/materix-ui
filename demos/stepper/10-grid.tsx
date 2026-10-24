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
          label="Shipment"
          steps={['Preparing', 'Shipped', 'Out for delivery', 'Delivered']}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Stepper orientation="vertical" defaultActiveStep={1} label="Support ticket">
          <Step label="Received" />
          <Step label="Under review">
            <p>An agent is reviewing your case.</p>
          </Step>
          <Step label="Resolved" />
        </Stepper>
      </Grid>
    </Grid>
  );
}
