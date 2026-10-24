import { Avatar } from '@rubenchodev/materix-react/components/avatar';

export const title = { en: 'Colors', es: 'Colores' };
export const description = {
  en: 'Without `color`, grey 600 with white text is used (`--mtx-avatar-default-bg` / `--mtx-avatar-default-color`, 4.6:1 AA contrast; MUI uses grey 400 at 1.8:1). `color` applies any palette color with its contrast text.',
  es: 'Sin `color` se usa gris 600 con texto blanco (`--mtx-avatar-default-bg` / `--mtx-avatar-default-color`, contraste AA 4.6:1; MUI usa gris 400 con 1.8:1). `color` aplica cualquier color de la paleta con su texto de contraste.',
};

export default function Demo() {
  return (
    <div className="demo-row">
      <Avatar>DF</Avatar>
      <Avatar color="primary">PR</Avatar>
      <Avatar color="secondary">SE</Avatar>
      <Avatar color="error">ER</Avatar>
      <Avatar color="warning">WA</Avatar>
      <Avatar color="info">IN</Avatar>
      <Avatar color="success">SU</Avatar>
    </div>
  );
}
