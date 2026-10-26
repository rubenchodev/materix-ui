import { Step, StepContent, StepLabel, Stepper } from '@rubenchodev/materix-react/components/stepper';

export const title = { en: 'Manual composition', es: 'Composición manual' };
export const description = {
  en: "Equivalent to vanilla manual BEM: each `Step` declares its `StepLabel` and `StepContent`.",
  es: "Equivalente al BEM manual de vanilla: cada `Step` declara su `StepLabel` y su `StepContent`.",
};

export default function Demo() {
  // Equivale al uso BEM manual de vanilla: cada Step declara sus partes.
  return (
    <div className="demo-stack">
      <Stepper defaultActiveStep={1} label="Manual">
        <Step>
          <StepLabel>Detalles</StepLabel>
        </Step>
        <Step>
          <StepLabel optional="Última comprobación">Revisión</StepLabel>
        </Step>
      </Stepper>
      <Stepper orientation="vertical" label="Manual vertical">
        <Step>
          <StepLabel icon="inventory_2">Empaquetar</StepLabel>
          <StepContent>
            <p>Cierra la caja y pega la etiqueta.</p>
          </StepContent>
        </Step>
        <Step>
          <StepLabel icon="local_shipping">Enviar</StepLabel>
        </Step>
      </Stepper>
    </div>
  );
}
