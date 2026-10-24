import { useState } from 'react';
import { Rating } from '@rubenchodev/materix-react/components/rating';

export const title = { en: 'Hover feedback', es: 'Texto al pasar el cursor' };
export const description = {
  en: "`onChangeActive` reports the value under the pointer or the focused radio (`null` on leave) to show a descriptive text, like MUI's hover feedback example. `getLabelText` adds it to each radio label.",
  es: "`onChangeActive` informa del valor bajo el cursor o del radio enfocado (`null` al salir) para mostrar un texto descriptivo, como el ejemplo hover feedback de MUI. `getLabelText` lo añade a la etiqueta de cada radio.",
};

const LABELS: Record<number, string> = {
  0.5: 'Useless',
  1: 'Useless+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Ok',
  3: 'Ok+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+',
};

export default function Demo() {
  const [value, setValue] = useState<number | null>(2);
  const [active, setActive] = useState<number | null>(null);
  const shown = active ?? value;
  return (
    <div className="demo-row">
      <Rating
        value={value}
        precision={0.5}
        aria-label="Quality"
        getLabelText={(n) => `${n} Star${n !== 1 ? 's' : ''}, ${LABELS[n]}`}
        onChange={(_, next) => setValue(next)}
        onChangeActive={(_, next) => setActive(next)}
      />
      <span className="demo-status">{shown !== null ? LABELS[shown] : 'No rating'}</span>
    </div>
  );
}
