import { useState } from 'react';
import '@rubenchodev/materix-ui/utilities.css';
import { Checkbox } from '@rubenchodev/materix-react/components/checkbox';
import { Stack } from '@rubenchodev/materix-react/components/stack';

export const title = { en: 'Indeterminate', es: 'Indeterminado' };
export const description = {
  en: "The indeterminate state shows that only some child options are checked. The indeterminate prop is controlled by the parent and keeps aria-checked=\"mixed\" in sync. Check or uncheck the options to see it in action.",
  es: "El estado indeterminado indica que solo algunas opciones hijas están marcadas. La prop indeterminate la controla el padre y mantiene aria-checked=\"mixed\" sincronizado. Marca o desmarca las opciones para verlo en acción.",
};

const PERMISSIONS = ['Read', 'Write', 'Delete'];

export default function Demo() {
  const [checked, setChecked] = useState([true, false, false]);
  const count = checked.filter(Boolean).length;

  return (
    <div className="demo-panel demo-fixed-width">
      <Checkbox
        label="All permissions"
        checked={count === checked.length}
        indeterminate={count > 0 && count < checked.length}
        onChange={(_, next) => setChecked(checked.map(() => next))}
      />
      <Stack spacing={1} alignItems="start" className="mtx-ps-3">
        {PERMISSIONS.map((permission, index) => (
          <Checkbox
            key={permission}
            label={permission}
            checked={checked[index]}
            onChange={(_, next) => setChecked(checked.map((value, i) => (i === index ? next : value)))}
          />
        ))}
      </Stack>
    </div>
  );
}
