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
      <Stepper apiRef={stepper.apiRef} label="Crear campaña">
        <Step label="Configuración" />
        <Step label="Grupo de anuncios" optional />
        <Step label="Crear anuncio" />
      </Stepper>
      <StepPanel stepper={stepper} index={0}>
        <Typography variant="body1">Paso 1: elige el objetivo y el presupuesto de la campaña.</Typography>
      </StepPanel>
      <StepPanel stepper={stepper} index={1}>
        <Typography variant="body1">Paso 2: define audiencias y ubicaciones (opcional).</Typography>
      </StepPanel>
      <StepPanel stepper={stepper} index={2}>
        <Typography variant="body1">Paso 3: redacta el anuncio y revisa la vista previa.</Typography>
      </StepPanel>
      <StepPanel stepper={stepper} index="finished">
        <Typography variant="body1">Todos los pasos completados. La campaña está lista para publicarse.</Typography>
      </StepPanel>
      <div className="demo-row">
        <StepperButton action="back" stepper={stepper}>Atrás</StepperButton>
        <StepperButton action="next" stepper={stepper} variant="contained">Siguiente</StepperButton>
        <StepperButton action="reset" stepper={stepper} variant="outlined">Reiniciar</StepperButton>
      </div>
    </div>
  );
}
