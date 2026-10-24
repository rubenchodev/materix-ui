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
        <span className="demo-label">Initials</span>
        <div className="demo-row">
          <Avatar color="primary">CI</Avatar>
          <Avatar variant="rounded" color="primary">RO</Avatar>
          <Avatar variant="square" color="primary">SQ</Avatar>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Image</span>
        <div className="demo-row">
          <Avatar src={photo} alt="Chris Reed" />
          <Avatar variant="rounded" src={photo} alt="Chris Reed" />
          <Avatar variant="square" src={photo} alt="Chris Reed" />
        </div>
      </div>
    </>
  );
}
