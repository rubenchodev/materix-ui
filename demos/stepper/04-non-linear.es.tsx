import { Step, Stepper } from '@rubenchodev/materix-react/components/stepper';

export const title = { en: 'Non-linear', es: 'No lineal' };
export const description = {
  en: "With `nonLinear` each step is a `<button>` (StepButton) with ripple and focus; completion is set with `completed` or `setCompleted()`.",
  es: "Con `nonLinear` cada paso es un `<button>` (StepButton) con ripple y foco; el completado se indica con `completed` o `setCompleted()`.",
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <Stepper nonLinear defaultActiveStep={1} label="Perfil">
        <Step label="Datos personales" completed />
        <Step label="Dirección" />
        <Step label="Preferencias" optional />
      </Stepper>
      <div className="demo-group">
        <span className="demo-label">No lineal con etiqueta alternativa</span>
        <Stepper nonLinear alternativeLabel label="Configuración del equipo">
          <Step label="Equipo" completed />
          <Step label="Miembros" />
          <Step label="Permisos" disabled />
        </Stepper>
      </div>
    </div>
  );
}
