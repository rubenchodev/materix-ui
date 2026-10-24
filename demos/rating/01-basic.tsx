import { Rating } from '@rubenchodev/materix-react/components/rating';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: "A single `<Rating />` renders five stars. `defaultValue` sets the initial value and `name` the radios' `name` (submitted with the form). Clicking the current value clears it.",
  es: "Un único `<Rating />` genera cinco estrellas. `defaultValue` fija el valor inicial y `name` el `name` de los radios (se envía con el formulario). Un clic sobre el valor actual lo borra.",
};

export default function Demo() {
  return <Rating defaultValue={3} name="product-score" aria-label="Product rating" />;
}
