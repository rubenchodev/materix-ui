import { Step, Stepper } from '@rubenchodev/materix-react/components/stepper';

export const title = { en: 'With and without icons', es: 'Con y sin iconos' };
export const description = {
  en: "By default the icon is the step number; `icon` uses a Material Icon. Completed shows a check and error a warning.",
  es: "Por defecto el icono es el número del paso; `icon` usa un Material Icon. Completado muestra un check y error un aviso.",
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">No custom icon (numbered)</span>
        <Stepper defaultActiveStep={1} label="Numbered" steps={['Account', 'Profile', 'Done']} />
      </div>
      <div className="demo-group">
        <span className="demo-label">With icon</span>
        <Stepper defaultActiveStep={1} label="With icons">
          <Step label="Account" icon="person" />
          <Step label="Payment" icon="credit_card" />
          <Step label="Shipping" icon="local_shipping" />
        </Stepper>
      </div>
    </div>
  );
}
