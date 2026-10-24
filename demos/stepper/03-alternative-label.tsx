import { Stepper } from '@rubenchodev/materix-react/components/stepper';

export const title = { en: 'Alternative label', es: 'Etiqueta alternativa' };
export const description = {
  en: "`alternativeLabel` places the label below the icon and splits the width evenly; the most stable option on narrow screens.",
  es: "`alternativeLabel` coloca la etiqueta bajo el icono y reparte el ancho por igual; la opción más estable en pantallas estrechas.",
};

export default function Demo() {
  return (
    <Stepper alternativeLabel defaultActiveStep={1} label="Order" steps={['Cart', 'Shipping', 'Payment', 'Confirmation']} />
  );
}
