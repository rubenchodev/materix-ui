import { Radio, RadioGroup } from '@rubenchodev/materix-react/components/radio';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: "Each option is a <Radio value label>; the RadioGroup gives them a shared name so they are mutually exclusive, adds role=\"radiogroup\", turns label into its FormLabel and owns the selected value.",
  es: "Cada opción es un <Radio value label>; el RadioGroup les da un name común para que sean excluyentes, añade role=\"radiogroup\", convierte label en su FormLabel y gestiona el valor seleccionado.",
};

export default function Demo() {
  return (
    <RadioGroup label="Plan" defaultValue="basic">
      <Radio value="basic" label="Basic" />
      <Radio value="pro" label="Professional" />
      <Radio value="enterprise" label="Enterprise" />
    </RadioGroup>
  );
}
