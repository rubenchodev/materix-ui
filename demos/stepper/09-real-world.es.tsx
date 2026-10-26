import { useState } from 'react';
import { Paper } from '@rubenchodev/materix-react/components/paper';
import { TextField } from '@rubenchodev/materix-react/components/text-field';
import { Typography } from '@rubenchodev/materix-react/components/typography';
import {
  StepPanel,
  Stepper,
  StepperButton,
  useStepper,
  type StepperChangeHandler,
} from '@rubenchodev/materix-react/components/stepper';

export const title = { en: 'Real-world examples', es: 'Ejemplos reales' };
export const description = {
  en: "A sign-up wizard with validation: the cancelable `onChange` returns `false` while the email is invalid and marks the step with `setError()`.",
  es: "Un asistente de alta con validación: el `onChange` cancelable devuelve `false` mientras el email no sea válido y marca el paso con `setError()`.",
};

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function Demo() {
  const stepper = useStepper();
  const [email, setEmail] = useState('');
  const [showError, setShowError] = useState(false);
  const isValid = EMAIL.test(email);

  // Cambio cancelable: no se avanza desde el primer paso con un email inválido.
  const handleChange: StepperChangeHandler = (activeStep, { previousStep }) => {
    if (previousStep === 0 && activeStep > 0) {
      stepper.setError(0, isValid ? false : 'Introduce un correo válido');
      setShowError(!isValid);
      if (!isValid) return false;
    }
    return undefined;
  };

  return (
    <div className="demo-surface">
      <Paper variant="outlined" className="demo-wide">
        <div className="demo-stack mtx-p-3">
          <Stepper
            apiRef={stepper.apiRef}
            alternativeLabel
            label="Alta de cuenta"
            onChange={handleChange}
            steps={['Cuenta', 'Empresa', 'Plan']}
          />
          <StepPanel stepper={stepper} index={0}>
            <TextField
              label="Correo de trabajo"
              variant="outlined"
              type="email"
              required
              value={email}
              onChange={(_, value) => {
                setEmail(value);
                if (showError && EMAIL.test(value)) {
                  setShowError(false);
                  stepper.setError(0, false);
                }
              }}
              error={showError}
              helperText={showError ? 'Introduce un correo válido' : undefined}
            />
          </StepPanel>
          <StepPanel stepper={stepper} index={1}>
            <TextField label="Nombre de la empresa" variant="outlined" />
          </StepPanel>
          <StepPanel stepper={stepper} index={2}>
            <Typography variant="body2">Plan Equipo · $12 por usuario al mes.</Typography>
          </StepPanel>
          <StepPanel stepper={stepper} index="finished">
            <Typography variant="body2">Tu cuenta está lista.</Typography>
          </StepPanel>
          <div className="demo-row">
            <StepperButton action="back" stepper={stepper}>
              Atrás
            </StepperButton>
            <StepperButton action="next" stepper={stepper} variant="contained">
              Siguiente
            </StepperButton>
          </div>
        </div>
      </Paper>
    </div>
  );
}
