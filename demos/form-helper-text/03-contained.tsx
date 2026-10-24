import { FormControl, FormHelperText } from '@rubenchodev/materix-react/components/form-helper-text';
import { TextField } from '@rubenchodev/materix-react/components/text-field';

export const title = { en: 'Contained', es: 'Contenido (contained)' };
export const description = {
  en: "contained adds a 14px inline margin so the helper lines up with the text of an outlined or filled field; without it, it starts at the control edge, as under a standard field.",
  es: "contained añade un margen lateral de 14px para que el texto se alinee con el de un campo outlined o filled; sin él, empieza en el borde del control, como bajo un campo standard.",
};

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">Default · aligned with the field edge</span>
        <FormControl>
          <TextField label="Company" variant="standard" />
          <FormHelperText>As it appears on your invoices.</FormHelperText>
        </FormControl>
      </div>
      <div className="demo-group">
        <span className="demo-label">contained · 14px inset (outlined/filled fields)</span>
        <FormControl>
          <TextField label="Company" variant="outlined" />
          <FormHelperText contained>Aligned with the text of the outlined field.</FormHelperText>
        </FormControl>
      </div>
    </div>
  );
}
