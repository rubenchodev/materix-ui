import { TextField } from '@rubenchodev/materix-react/components/text-field';

export const title = { en: 'With and without icons', es: 'Con y sin iconos' };
export const description = {
  en: '`startIcon` and `endIcon` accept a Material Icons name, an image URL or a node. With a start icon, the label lines up with the typed text. `startAdornment` and `endAdornment` take free text such as a prefix or a unit; with a text prefix the label stays floated at the start of the field.',
  es: '`startIcon` y `endIcon` aceptan un nombre de Material Icons, una URL de imagen o un nodo. Con icono inicial, el label se alinea con el texto escrito. `startAdornment` y `endAdornment` aceptan texto libre como un prefijo o una unidad; con un prefijo de texto el label queda flotando al inicio del campo.',
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-grid-4">
        <div className="demo-group">
          <span className="demo-label">No icon</span>
          <TextField label="Username" />
        </div>
        <div className="demo-group">
          <span className="demo-label">Start icon</span>
          <TextField label="Username" startIcon="account_circle" />
        </div>
        <div className="demo-group">
          <span className="demo-label">End icon</span>
          <TextField label="API key" endIcon="lock" type="password" />
        </div>
        <div className="demo-group">
          <span className="demo-label">Start image</span>
          <TextField label="Phone" startIcon="https://flagcdn.com/w20/co.png" type="tel" />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Icons in filled and standard, medium and small</span>
        <div className="demo-grid-4">
          <TextField label="Email" variant="filled" startIcon="email" type="email" />
          <TextField label="Website" variant="standard" startIcon="language" endIcon="open_in_new" type="url" />
          <TextField label="Email" variant="filled" size="small" startIcon="email" type="email" />
          <TextField label="Username" size="small" startIcon="person" />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Text adornments · startAdornment / endAdornment</span>
        <div className="demo-grid-3">
          <TextField label="Amount" startAdornment="$" inputMode="decimal" />
          <TextField label="Price" variant="filled" startAdornment="€" endAdornment="EUR" inputMode="decimal" />
          <TextField label="Website" variant="standard" startAdornment="https://" />
          <TextField label="Weight" size="small" startAdornment="≈" endAdornment="kg" inputMode="decimal" />
          <TextField label="Amount" variant="filled" size="small" startAdornment="$" inputMode="decimal" />
          <TextField label="Domain" variant="standard" size="large" startAdornment="www." />
        </div>
      </div>
    </div>
  );
}
