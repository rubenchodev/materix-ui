import { useRef, useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Stepper, type StepperApi } from '@rubenchodev/materix-react/components/stepper';

export const title = { en: 'Programmatic usage', es: 'Uso programático' };
export const description = {
  en: "`apiRef` exposes `next()`, `back()`, `goTo()`, `reset()`, `setCompleted()`, `setError()` and `activeStep`; every change goes through `onChange`.",
  es: "`apiRef` expone `next()`, `back()`, `goTo()`, `reset()`, `setCompleted()`, `setError()` y `activeStep`; todo cambio pasa por `onChange`.",
};

export default function Demo() {
  const api = useRef<StepperApi>(null);
  const [log, setLog] = useState<string[]>([]);
  const write = (text: string) => setLog((lines) => [text, ...lines].slice(0, 8));
  const run = (fn: (stepper: StepperApi) => void) => {
    if (api.current) fn(api.current);
  };

  return (
    <div className="demo-stack">
      <Stepper
        apiRef={api}
        nonLinear
        label="API"
        steps={['One', 'Two', 'Three', 'Four']}
        onChange={(activeStep, { previousStep }) => {
          write(`onChange → activeStep ${activeStep}, previousStep ${previousStep}`);
        }}
      />
      <div className="demo-row">
        <Button variant="outlined" size="small" onClick={() => run((s) => s.back())}>
          back()
        </Button>
        <Button variant="outlined" size="small" onClick={() => run((s) => s.next())}>
          next()
        </Button>
        <Button variant="outlined" size="small" onClick={() => run((s) => s.goTo(3))}>
          goTo(3)
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() =>
            run((s) => {
              s.setCompleted(s.activeStep, !s.isCompleted(s.activeStep));
              write(`setCompleted(${s.activeStep})`);
            })
          }
        >
          setCompleted(active)
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() =>
            run((s) => {
              s.setError(s.activeStep, 'Check this step');
              write(`setError(${s.activeStep})`);
            })
          }
        >
          setError(active)
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() =>
            run((s) => {
              s.reset();
              write('reset()');
            })
          }
        >
          reset()
        </Button>
      </div>
      <pre className="demo-log" aria-live="polite">
        {log.join('\n')}
      </pre>
    </div>
  );
}
