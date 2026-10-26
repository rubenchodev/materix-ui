import { Avatar } from '@rubenchodev/materix-react/components/avatar';
import { Badge } from '@rubenchodev/materix-react/components/badge';

export const title = { en: 'Overlap', es: 'Superposición' };
export const description = {
  en: '`overlap="rectangular"` (default) uses the corners of the box; `circular` moves the badge closer to the edge of round shapes.',
  es: '`overlap="rectangular"` (por defecto) usa las esquinas de la caja; `circular` acerca la insignia al borde de las formas redondas.',
};

export default function Demo() {
  return (
    <>
      <div className="demo-group">
        <span className="demo-label">Rectangular</span>
        <div className="demo-row mtx-gap-4 mtx-pt-1 mtx-px-1">
          <Badge variant="dot" color="error">
            <Avatar variant="square" color="primary">R</Avatar>
          </Badge>
          <Badge badgeContent={6} color="error">
            <Avatar variant="square" color="primary">R</Avatar>
          </Badge>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Circular (cuatro anclajes)</span>
        <div className="demo-row mtx-gap-4 mtx-pt-1 mtx-px-1">
          <Badge variant="dot" color="error" overlap="circular">
            <Avatar color="secondary">C</Avatar>
          </Badge>
          <Badge badgeContent={6} color="error" overlap="circular" anchor="top-left">
            <Avatar color="secondary">C</Avatar>
          </Badge>
          <Badge badgeContent={6} color="error" overlap="circular" anchor="bottom-right">
            <Avatar color="secondary">C</Avatar>
          </Badge>
          <Badge badgeContent={6} color="error" overlap="circular" anchor="bottom-left">
            <Avatar color="secondary">C</Avatar>
          </Badge>
        </div>
      </div>
    </>
  );
}
