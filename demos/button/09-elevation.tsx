import { Button } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'No elevation', es: 'Sin elevación' };
export const description = {
  en: "`disableElevation` removes the shadow of the contained variant in all its states (MUI's `disableElevation`).",
  es: "`disableElevation` elimina la sombra de la variante contained en todos sus estados (el `disableElevation` de MUI).",
};

export default function Demo() {
  return (
    <div className="demo-row">
      <Button variant="contained">With elevation</Button>
      <Button variant="contained" disableElevation>No elevation</Button>
    </div>
  );
}
