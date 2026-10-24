import { Step, Stepper, StepperButton } from '@rubenchodev/materix-react/components/stepper';

export const title = { en: 'Vertical', es: 'Vertical' };
export const description = {
  en: "`orientation=\"vertical\"` stacks the steps; the children of each `Step` become StepContent, expanded only on the active step. `StepperButton` without `stepper` acts on its own stepper.",
  es: "`orientation=\"vertical\"` apila los pasos; los hijos de cada `Step` pasan a StepContent, expandido solo en el paso activo. `StepperButton` sin `stepper` actúa sobre su propio stepper.",
};

export default function Demo() {
  return (
    <div className="demo-wide">
      <Stepper orientation="vertical" label="Launch a campaign">
        <Step label="Select campaign settings">
          <p>Choose the campaign type, the country and the daily budget.</p>
          <div className="demo-row">
            <StepperButton action="next" variant="contained" size="small">Continue</StepperButton>
          </div>
        </Step>
        <Step label="Create an ad group" optional>
          <p>An ad group contains one or more ads that share the same audience.</p>
          <div className="demo-row">
            <StepperButton action="next" variant="contained" size="small">Continue</StepperButton>
            <StepperButton action="back" size="small">Back</StepperButton>
          </div>
        </Step>
        <Step label="Create an ad">
          <p>Write the headline and the description. Check the preview before publishing.</p>
          <div className="demo-row">
            <StepperButton action="next" variant="contained" size="small">Finish</StepperButton>
            <StepperButton action="back" size="small">Back</StepperButton>
          </div>
        </Step>
      </Stepper>
    </div>
  );
}
