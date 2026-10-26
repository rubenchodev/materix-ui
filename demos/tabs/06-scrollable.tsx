import { Tab, Tabs } from '@rubenchodev/materix-react/components/tabs';

export const title = { en: 'Scrollable', es: 'Desplazable' };
export const description = {
  en: "When the tabs do not fit, the bar scrolls horizontally (touch, wheel or keyboard) with a hidden scrollbar, and the indicator follows the active tab. It starts on June, as in vanilla.",
  es: "Si las pestañas no caben, la barra se desplaza en horizontal (táctil, rueda o teclado) con la barra de desplazamiento oculta, y el indicador sigue a la pestaña activa. Arranca en junio, como en vanilla.",
};

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function Demo() {
  return (
    <Tabs aria-label="Months" defaultValue="June">
      {MONTHS.map((month) => (
        <Tab key={month} value={month} label={month} />
      ))}
    </Tabs>
  );
}
