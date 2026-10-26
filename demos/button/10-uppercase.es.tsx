import { Button } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'Uppercase', es: 'Mayúsculas' };
export const description = {
  en: "The text is shown as written. Add `uppercase` for the uppercase style characteristic of Material Design 2.",
  es: "El texto se muestra tal como se escribe. Añade `uppercase` para el estilo en mayúsculas característico de Material Design 2.",
};

export default function Demo() {
  return (
    <div className="demo-row">
      <Button variant="contained">Texto tal cual</Button>
      <Button variant="contained" uppercase>Mayúsculas</Button>
      <Button variant="outlined" uppercase>Outlined</Button>
    </div>
  );
}
