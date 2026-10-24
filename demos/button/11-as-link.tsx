import { Button } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'As a link', es: 'Como enlace' };
export const description = {
  en: "If the action navigates to another page, pass `href`: the button renders an `<a>` and keeps link semantics (open in a new tab, copy URL) with the look of a button. A disabled link gets `aria-disabled` and its click is blocked.",
  es: "Si la acción navega a otra página, pasa `href`: el botón renderiza un `<a>` y conserva la semántica de enlace (abrir en otra pestaña, copiar la URL) con el aspecto de un botón. Un enlace deshabilitado recibe `aria-disabled` y se bloquea su clic.",
};

export default function Demo() {
  return (
    <div className="demo-row">
      <Button variant="contained" href="#as-link">See plans</Button>
      <Button variant="outlined" href="#as-link">Documentation</Button>
      <Button href="#as-link">Learn more</Button>
      <Button variant="outlined" href="#as-link" disabled>Disabled link</Button>
    </div>
  );
}
