import { useState } from 'react';
import { NativeSelect } from '@rubenchodev/materix-react/components/native-select';

export const title = { en: 'Helper and error text', es: 'Texto de ayuda y de error' };
export const description = {
  en: '`helperText` adds a FormHelperText below the field, linked with `aria-describedby`; together with `error` it becomes the error message. The second select validates as you choose.',
  es: '`helperText` añade un FormHelperText bajo el campo, enlazado con `aria-describedby`; junto con `error` se convierte en el mensaje de error. El segundo select se valida al elegir.',
};

const SIZES = [
  { value: '', label: 'Not chosen' },
  { value: 's', label: 'S' },
  { value: 'm', label: 'M' },
  { value: 'l', label: 'L' },
];

export default function Demo() {
  const [size, setSize] = useState('');
  return (
    <div className="demo-grid-2">
      <NativeSelect
        variant="outlined"
        label="Shipping"
        helperText="Delivery time depends on the method."
        options={[{ value: 'std', label: 'Standard (5 days)' }, { value: 'exp', label: 'Express (1 day)' }]}
      />
      <NativeSelect
        variant="outlined"
        label="Size"
        required
        value={size}
        onChange={(_, value) => setSize(value as string)}
        error={size === ''}
        helperText={size === '' ? 'Choose a size.' : `Size ${size.toUpperCase()} selected.`}
        options={SIZES}
      />
    </div>
  );
}
