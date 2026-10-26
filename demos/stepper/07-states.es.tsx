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
        <span className="demo-label">Error con mensaje</span>
        <Stepper defaultActiveStep={2} label="Pago">
          <Step label="Dirección" />
          <Step label="Pago" error="Tarjeta rechazada" />
          <Step label="Revisión" />
        </Stepper>
      </div>
      <div className="demo-group">
        <span className="demo-label">Opcional, completado explícitamente y deshabilitado (no lineal)</span>
        <Stepper nonLinear defaultActiveStep={0} label="Estados">
          <Step label="Activo" />
          <Step label="Completado" completed />
          <Step label="Opcional" optional="Se puede omitir" />
          <Step label="Deshabilitado" disabled />
        </Stepper>
      </div>
    </div>
  );
}
