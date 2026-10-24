import { Radio, RadioGroup } from '@rubenchodev/materix-react/components/radio';

export const title = { en: 'Colors', es: 'Colores' };
export const description = {
  en: "Primary is the default. Use the color prop on each Radio: secondary, success, error, warning or info.",
  es: "Primary es el color por defecto. Usa la prop color en cada Radio: secondary, success, error, warning o info.",
};

export default function Demo() {
  return (
    <RadioGroup row aria-label="Colors" defaultValue="primary">
      <Radio value="primary" label="Primary" />
      <Radio value="secondary" label="Secondary" color="secondary" />
      <Radio value="success" label="Success" color="success" />
      <Radio value="error" label="Error" color="error" />
      <Radio value="warning" label="Warning" color="warning" />
      <Radio value="info" label="Info" color="info" />
    </RadioGroup>
  );
}
