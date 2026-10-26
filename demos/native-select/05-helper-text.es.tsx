import { useState } from 'react';
import { NativeSelect } from '@rubenchodev/materix-react/components/native-select';

export const title = { en: 'Helper and error text', es: 'Texto de ayuda y de error' };
export const description = {
  en: '`helperText` adds a FormHelperText below the field, linked with `aria-describedby`; together with `error` it becomes the error message. The second select validates as you choose.',
  es: '`helperText` añade un FormHelperText bajo el campo, enlazado con `aria-describedby`; junto con `error` se convierte en el mensaje de error. El segundo select se valida al elegir.',
};

const SIZES = [
  { value: '', label: 'Sin elegir' },
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
        label="Envío"
        helperText="El plazo de entrega depende del método."
        options={[{ value: 'std', label: 'Estándar (5 días)' }, { value: 'exp', label: 'Exprés (1 día)' }]}
      />
      <NativeSelect
        variant="outlined"
        label="Talla"
        required
        value={size}
        onChange={(_, value) => setSize(value as string)}
        error={size === ''}
        helperText={size === '' ? 'Elige una talla.' : `Talla ${size.toUpperCase()} seleccionada.`}
        options={SIZES}
      />
    </div>
  );
}
