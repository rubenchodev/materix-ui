import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Radio, RadioGroup } from '@rubenchodev/materix-react/components/radio';

export const title = { en: 'Use cases', es: 'Casos de uso' };
export const description = {
  en: "Choosing the shipping method at checkout: a few options, all visible and mutually exclusive. With more than 5–7 options, a Select would take up less space.",
  es: "Elegir el método de envío al pagar: pocas opciones, todas visibles y excluyentes. Con más de 5–7 opciones, un Select ocuparía menos espacio.",
};

const LABELS: Record<string, string> = {
  standard: 'Estándar (3–5 días) · Gratis',
  express: 'Exprés (24 h) · $6,90',
  pickup: 'Recogida en tienda · Gratis',
};

export default function Demo() {
  const [shipping, setShipping] = useState('standard');
  const [status, setStatus] = useState('');
  return (
    <div className="demo-panel demo-wide">
      <RadioGroup label="Método de envío" value={shipping} onChange={(_, value) => setShipping(value)}>
        {Object.entries(LABELS).map(([value, label]) => (
          <Radio key={value} value={value} label={label} />
        ))}
      </RadioGroup>
      <div className="demo-row">
        <Button variant="contained" onClick={() => setStatus(`Seleccionado: ${LABELS[shipping]}`)}>
          Continuar
        </Button>
        <span className="demo-status" aria-live="polite">
          {status}
        </span>
      </div>
    </div>
  );
}
