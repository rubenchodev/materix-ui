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
          <span className="demo-label">Sin icono</span>
          <TextField label="Usuario" />
        </div>
        <div className="demo-group">
          <span className="demo-label">Icono inicial</span>
          <TextField label="Usuario" startIcon="account_circle" />
        </div>
        <div className="demo-group">
          <span className="demo-label">Icono final</span>
          <TextField label="Clave de API" endIcon="lock" type="password" />
        </div>
        <div className="demo-group">
          <span className="demo-label">Imagen inicial</span>
          <TextField label="Teléfono" startIcon="https://flagcdn.com/w20/co.png" type="tel" />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Iconos en filled y standard, medium y small</span>
        <div className="demo-grid-4">
          <TextField label="Correo" variant="filled" startIcon="email" type="email" />
          <TextField label="Sitio web" variant="standard" startIcon="language" endIcon="open_in_new" type="url" />
          <TextField label="Correo" variant="filled" size="small" startIcon="email" type="email" />
          <TextField label="Usuario" size="small" startIcon="person" />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Adornos de texto · startAdornment / endAdornment</span>
        <div className="demo-grid-3">
          <TextField label="Importe" startAdornment="$" inputMode="decimal" />
          <TextField label="Precio" variant="filled" startAdornment="€" endAdornment="EUR" inputMode="decimal" />
          <TextField label="Sitio web" variant="standard" startAdornment="https://" />
          <TextField label="Peso" size="small" startAdornment="≈" endAdornment="kg" inputMode="decimal" />
          <TextField label="Importe" variant="filled" size="small" startAdornment="$" inputMode="decimal" />
          <TextField label="Dominio" variant="standard" size="large" startAdornment="www." />
        </div>
      </div>
    </div>
  );
}
