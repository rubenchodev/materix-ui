import { Avatar } from '@rubenchodev/materix-react/components/avatar';

export const title = { en: 'Variants', es: 'Variantes' };
export const description = {
  en: '`variant` sets the shape: `circular` (default), `rounded` (4px radius) or `square`.',
  es: '`variant` define la forma: `circular` (por defecto), `rounded` (radio de 4px) o `square`.',
};

const photo = 'https://i.pravatar.cc/120?img=12';

export default function Demo() {
  return (
    <>
      <div className="demo-group">
        <span className="demo-label">Iniciales</span>
        <div className="demo-row">
          <Avatar color="primary">CI</Avatar>
          <Avatar variant="rounded" color="primary">RE</Avatar>
          <Avatar variant="square" color="primary">CU</Avatar>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Imagen</span>
        <div className="demo-row">
          <Avatar src={photo} alt="Carlos Ruiz" />
          <Avatar variant="rounded" src={photo} alt="Carlos Ruiz" />
          <Avatar variant="square" src={photo} alt="Carlos Ruiz" />
        </div>
      </div>
    </>
  );
}
