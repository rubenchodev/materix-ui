import { Step, Stepper } from '@rubenchodev/materix-react/components/stepper';

export const title = { en: 'States', es: 'Estados' };
export const description = {
  en: "Active, completed, `optional` (with custom text), `error` with a message and `disabled`.",
  es: "Activo, completado, `optional` (con texto propio), `error` con mensaje y `disabled`.",
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">Error with message</span>
        <Stepper defaultActiveStep={2} label="Payment">
          <Step label="Address" />
          <Step label="Payment" error="Card declined" />
          <Step label="Review" />
        </Stepper>
      </div>
      <div className="demo-group">
        <span className="demo-label">Optional, explicitly completed and disabled (non-linear)</span>
        <Stepper nonLinear defaultActiveStep={0} label="States">
          <Step label="Active" />
          <Step label="Completed" completed />
          <Step label="Optional" optional="Can be skipped" />
          <Step label="Disabled" disabled />
        </Stepper>
      </div>
    </div>
  );
}
