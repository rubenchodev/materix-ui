import { Switch } from '@rubenchodev/materix-react/components/switch';
import { FormControl, FormLabel } from '@rubenchodev/materix-react/components/form-helper-text';
import { Stack } from '@rubenchodev/materix-react/components/stack';

export const title = { en: 'Grouping', es: 'Agrupación' };
export const description = {
  en: "Group related switches under a FormLabel (role=\"group\" + aria-labelledby). Each one stays independent: turning one on does not affect the others.",
  es: "Agrupa los interruptores relacionados bajo un FormLabel (role=\"group\" + aria-labelledby). Cada uno es independiente: activar uno no afecta a los demás.",
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <FormControl role="group" aria-labelledby="switch-notify-label">
        <FormLabel id="switch-notify-label" className="mtx-mb-1">
          Notifications
        </FormLabel>
        <Stack spacing={1.5} alignItems="start">
          <Switch name="notify" value="push" label="Push notifications" defaultChecked />
          <Switch name="notify" value="email" label="Email digest" />
          <Switch name="notify" value="sms" label="SMS alerts" />
        </Stack>
      </FormControl>
    </div>
  );
}
