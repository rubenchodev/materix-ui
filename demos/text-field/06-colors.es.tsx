import { TextField } from '@rubenchodev/materix-react/components/text-field';

export const title = { en: 'Colors', es: 'Colores' };
export const description = {
  en: '`color` changes the focus color (label, border and underline). Click or use Tab on each field.',
  es: '`color` cambia el color de foco (label, borde y subrayado). Haz clic o usa Tab en cada campo.',
};

export default function Demo() {
  return (
    <div className="demo-grid-3">
      <TextField label="Primary (por defecto)" />
      <TextField label="Secondary" color="secondary" />
      <TextField label="Success" color="success" variant="filled" />
      <TextField label="Warning" color="warning" />
      <TextField label="Info" color="info" variant="standard" />
    </div>
  );
}
