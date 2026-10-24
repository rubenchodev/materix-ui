import { Typography } from '@rubenchodev/materix-react/components/typography';
import { Step, StepPanel, Stepper, StepperButton, useStepper } from '@rubenchodev/materix-react/components/stepper';

export const title = { en: 'Linear with actions', es: 'Lineal con acciones' };
export const description = {
  en: "In linear mode previous steps are completed and the next ones disabled. `useStepper` links the stepper, `StepperButton` navigates it and `StepPanel` shows the active panel (`index=\"finished\"` at the end).",
  es: "En modo lineal los pasos anteriores quedan completados y los siguientes deshabilitados. `useStepper` enlaza el stepper, `StepperButton` lo navega y `StepPanel` muestra el panel activo (`index=\"finished\"` al final).",
};

export default function Demo() {
  const stepper = useStepper();
  return (
    <div className="demo-stack">
      <Stepper apiRef={stepper.apiRef} label="Create campaign">
        <Step label="Settings" />
        <Step label="Ad group" optional />
        <Step label="Create ad" />
      </Stepper>
      <StepPanel stepper={stepper} index={0}>
        <Typography variant="body1">Step 1: choose the campaign goal and budget.</Typography>
      </StepPanel>
      <StepPanel stepper={stepper} index={1}>
        <Typography variant="body1">Step 2: define audiences and placements (optional).</Typography>
      </StepPanel>
      <StepPanel stepper={stepper} index={2}>
        <Typography variant="body1">Step 3: write the ad and check the preview.</Typography>
      </StepPanel>
      <StepPanel stepper={stepper} index="finished">
        <Typography variant="body1">All steps completed. The campaign is ready to publish.</Typography>
      </StepPanel>
      <div className="demo-row">
        <StepperButton action="back" stepper={stepper}>Back</StepperButton>
        <StepperButton action="next" stepper={stepper} variant="contained">Next</StepperButton>
        <StepperButton action="reset" stepper={stepper} variant="outlined">Reset</StepperButton>
      </div>
    </div>
  );
}
