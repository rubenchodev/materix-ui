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
        <span className="demo-label">Por defecto · alineado con el borde del campo</span>
        <FormControl>
          <TextField label="Empresa" variant="standard" />
          <FormHelperText>Tal como aparece en tus facturas.</FormHelperText>
        </FormControl>
      </div>
      <div className="demo-group">
        <span className="demo-label">contained · margen de 14px (campos outlined/filled)</span>
        <FormControl>
          <TextField label="Empresa" variant="outlined" />
          <FormHelperText contained>Alineado con el texto del campo outlined.</FormHelperText>
        </FormControl>
      </div>
    </div>
  );
}
