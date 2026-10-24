import { useState } from 'react';
import { TextField } from '@rubenchodev/materix-react/components/text-field';
import type { TextFieldChangeDetails } from '@rubenchodev/materix-react/components/text-field';

export const title = { en: 'Input masks', es: 'Máscaras de entrada' };
export const description = {
  en: '`mask` accepts a pattern (`0` digit, `a` lowercase letter, `A` uppercase letter, `*` alphanumeric), a preset or `currency`. Type in any field to see its clean value below.',
  es: '`mask` acepta un patrón (`0` dígito, `a` letra minúscula, `A` letra mayúscula, `*` alfanumérico), un atajo o `currency`. Escribe en cualquier campo para ver su valor limpio debajo.',
};

export default function Demo() {
  const [status, setStatus] = useState('value · unmaskedValue · isMaskComplete will appear here.');
  const inspect = (_: unknown, value: string, details: TextFieldChangeDetails) =>
    setStatus(`value: "${value}" · unmaskedValue: "${details.unmaskedValue}" · isMaskComplete: ${details.isMaskComplete}`);

  return (
    <div className="demo-stack">
      <div className="demo-grid-3">
        <div className="demo-group">
          <span className="demo-label">Pattern · (000) 000-0000</span>
          <TextField label="Phone" mask="(000) 000-0000" startIcon="phone" type="tel" onChange={inspect} />
        </div>
        <div className="demo-group">
          <span className="demo-label">Preset · credit-card</span>
          <TextField label="Card" mask="credit-card" startIcon="credit_card" inputMode="numeric" onChange={inspect} />
        </div>
        <div className="demo-group">
          <span className="demo-label">Preset · date</span>
          <TextField label="Date" mask="date" startIcon="calendar_today" inputMode="numeric" onChange={inspect} />
        </div>
        <div className="demo-group">
          <span className="demo-label">Pattern · AAA-000</span>
          <TextField label="License plate" mask="AAA-000" startIcon="directions_car" onChange={inspect} />
        </div>
        <div className="demo-group">
          <span className="demo-label">Currency · $ 1,250.00</span>
          <TextField label="Price" mask="currency" startIcon="payments" inputMode="numeric" onChange={inspect} />
        </div>
        <div className="demo-group">
          <span className="demo-label">Currency · 1.250,00 €</span>
          <TextField
            label="Amount"
            mask="currency"
            currencyOptions={{ prefix: '', suffix: ' €', thousands: '.', decimal: ',' }}
            inputMode="numeric"
            onChange={inspect}
          />
        </div>
      </div>
      <p className="demo-status" aria-live="polite">
        {status}
      </p>
    </div>
  );
}
