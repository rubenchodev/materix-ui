import { Step, Stepper, StepperButton } from '@rubenchodev/materix-react/components/stepper';

export const title = { en: 'Vertical', es: 'Vertical' };
export const description = {
  en: "`orientation=\"vertical\"` stacks the steps; the children of each `Step` become StepContent, expanded only on the active step. `StepperButton` without `stepper` acts on its own stepper.",
  es: "`orientation=\"vertical\"` apila los pasos; los hijos de cada `Step` pasan a StepContent, expandido solo en el paso activo. `StepperButton` sin `stepper` actúa sobre su propio stepper.",
};

export default function Demo() {
  return (
    <div className="demo-wide">
      <Stepper orientation="vertical" label="Lanzar una campaña">
        <Step label="Elegir la configuración de la campaña">
          <p>Elige el tipo de campaña, el país y el presupuesto diario.</p>
          <div className="demo-row">
            <StepperButton action="next" variant="contained" size="small">Continuar</StepperButton>
          </div>
        </Step>
        <Step label="Crear un grupo de anuncios" optional>
          <p>Un grupo de anuncios contiene uno o más anuncios que comparten la misma audiencia.</p>
          <div className="demo-row">
            <StepperButton action="next" variant="contained" size="small">Continuar</StepperButton>
            <StepperButton action="back" size="small">Atrás</StepperButton>
          </div>
        </Step>
        <Step label="Crear un anuncio">
          <p>Escribe el titular y la descripción. Revisa la vista previa antes de publicar.</p>
          <div className="demo-row">
            <StepperButton action="next" variant="contained" size="small">Finalizar</StepperButton>
            <StepperButton action="back" size="small">Atrás</StepperButton>
          </div>
        </Step>
      </Stepper>
    </div>
  );
}
