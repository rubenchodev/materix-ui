import { TextField } from '@rubenchodev/materix-react/components/text-field';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: 'A single `TextField` with `label`. The component renders the floating label, the border notch and the helper text; if `label` is missing, the `placeholder` is used. `multiline` renders a `<textarea>`.',
  es: 'Un solo `TextField` con `label`. El componente genera el label flotante, la muesca del borde y el texto de ayuda; si falta `label`, se usa el `placeholder`. `multiline` genera un `<textarea>`.',
};

export default function Demo() {
  return (
    <div className="demo-grid-3">
      <TextField label="Full name" />
      <TextField placeholder="Email (label from placeholder)" type="email" />
      <TextField label="Comment" multiline rows={1} />
    </div>
  );
}
