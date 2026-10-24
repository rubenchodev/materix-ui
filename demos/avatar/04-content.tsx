import { Avatar } from '@rubenchodev/materix-react/components/avatar';

export const title = { en: 'Image, letters and icon', es: 'Imagen, letras e icono' };
export const description = {
  en: 'Content is resolved in order: `src`, `icon` and, if there is nothing, the children. Icons keep their native 24px grid; `icon` also accepts any node (an SVG, for example).',
  es: 'El contenido se resuelve en orden: `src`, `icon` y, si no hay nada, los hijos. Los iconos conservan su cuadrícula nativa de 24px; `icon` acepta también cualquier nodo (un SVG, por ejemplo).',
};

export default function Demo() {
  return (
    <>
      <div className="demo-group">
        <span className="demo-label">Image (src and imgProps)</span>
        <div className="demo-row">
          <Avatar src="https://i.pravatar.cc/120?img=32" alt="Lucy Miller" />
          <Avatar src="https://i.pravatar.cc/120?img=15" alt="George Park" imgProps={{ loading: 'lazy' }} />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Letters</span>
        <div className="demo-row">
          <Avatar>A</Avatar>
          <Avatar color="primary">JM</Avatar>
          <Avatar color="warning">OP</Avatar>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Icon</span>
        <div className="demo-row">
          <Avatar icon="person" role="img" aria-label="User" />
          <Avatar icon="pageview" color="info" role="img" aria-label="Preview" />
          <Avatar icon="assignment" variant="rounded" color="success" role="img" aria-label="Tasks" />
        </div>
      </div>
    </>
  );
}
