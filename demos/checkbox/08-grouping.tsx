import { Checkbox } from '@rubenchodev/materix-react/components/checkbox';
import { FormControl, FormLabel } from '@rubenchodev/materix-react/components/form-helper-text';
import { Stack } from '@rubenchodev/materix-react/components/stack';

export const title = { en: 'Grouping', es: 'Agrupación' };
export const description = {
  en: "Group related checkboxes under a FormLabel (role=\"group\" + aria-labelledby): screen readers announce the label when entering the group. Use the same name to submit them together in a form.",
  es: "Agrupa las casillas relacionadas bajo un FormLabel (role=\"group\" + aria-labelledby): los lectores de pantalla anuncian el rótulo al entrar en el grupo. Usa el mismo name para enviarlas juntas en un formulario.",
};

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <FormControl role="group" aria-labelledby="checkbox-notify-label">
        <FormLabel id="checkbox-notify-label" className="mtx-mb-1">
          Email notifications
        </FormLabel>
        <Stack spacing={1} alignItems="start">
          <Checkbox name="notify" value="comments" label="Comments" defaultChecked />
          <Checkbox name="notify" value="mentions" label="Mentions" defaultChecked />
          <Checkbox name="notify" value="digest" label="Weekly digest" />
        </Stack>
      </FormControl>
      <FormControl role="group" aria-labelledby="checkbox-topics-label">
        <FormLabel id="checkbox-topics-label" className="mtx-mb-1">
          Interests (small)
        </FormLabel>
        <Stack spacing={1} alignItems="start">
          <Checkbox name="topics" value="design" label="Design" size="small" />
          <Checkbox name="topics" value="frontend" label="Frontend" size="small" defaultChecked />
          <Checkbox name="topics" value="a11y" label="Accessibility" size="small" defaultChecked />
        </Stack>
      </FormControl>
    </div>
  );
}
