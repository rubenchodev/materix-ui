import { Step, Stepper } from '@rubenchodev/materix-react/components/stepper';

export const title = { en: 'Non-linear', es: 'No lineal' };
export const description = {
  en: "With `nonLinear` each step is a `<button>` (StepButton) with ripple and focus; completion is set with `completed` or `setCompleted()`.",
  es: "Con `nonLinear` cada paso es un `<button>` (StepButton) con ripple y foco; el completado se indica con `completed` o `setCompleted()`.",
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <Stepper nonLinear defaultActiveStep={1} label="Profile">
        <Step label="Personal details" completed />
        <Step label="Address" />
        <Step label="Preferences" optional />
      </Stepper>
      <div className="demo-group">
        <span className="demo-label">Non-linear with alternative label</span>
        <Stepper nonLinear alternativeLabel label="Team setup">
          <Step label="Team" completed />
          <Step label="Members" />
          <Step label="Permissions" disabled />
        </Stepper>
      </div>
    </div>
  );
}
