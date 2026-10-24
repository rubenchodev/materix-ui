import { Button } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: "A single `<Button>` with its `variant`. The component renders a native `<button type=\"button\">`, adds the ripple and manages the disabled state; there is no inner structure to write.",
  es: "Un único `<Button>` con su `variant`. El componente renderiza un `<button type=\"button\">` nativo, añade el ripple y gestiona el estado deshabilitado; no hay estructura interna que escribir.",
};

export default function Demo() {
  return (
    <div className="demo-row">
      <Button variant="contained">Save</Button>
      <Button variant="outlined">Preview</Button>
      <Button>Cancel</Button>
    </div>
  );
}
