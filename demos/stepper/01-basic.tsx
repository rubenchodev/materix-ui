import { Stepper } from '@rubenchodev/materix-react/components/stepper';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: "A `Stepper` with a `steps` array: it renders the `<ol>`, the numbered icons, the connectors and the accessible text, and marks the active step with `aria-current=\"step\"`.",
  es: "Un `Stepper` con un array `steps`: genera el `<ol>`, los iconos numerados, los conectores y el texto accesible, y marca el paso activo con `aria-current=\"step\"`.",
};

export default function Demo() {
  return <Stepper defaultActiveStep={1} label="Reset password" steps={['Email', 'Verify code', 'New password']} />;
}
