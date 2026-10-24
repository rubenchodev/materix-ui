import { Avatar } from '@rubenchodev/materix-react/components/avatar';

export const title = { en: 'States', es: 'Estados' };
export const description = {
  en: 'Avatar is not interactive: its states are about content. With an image it shows the photo; without an image or icon it switches to fallback mode (`mtx-avatar--fallback`) and shows the initials or the children.',
  es: 'Avatar no es interactivo: sus estados son de contenido. Con imagen muestra la foto; sin imagen ni icono pasa a modo fallback (`mtx-avatar--fallback`) y muestra las iniciales o los hijos.',
};

export default function Demo() {
  return (
    <>
      <div className="demo-group">
        <span className="demo-label">With image</span>
        <div className="demo-row">
          <Avatar src="https://i.pravatar.cc/120?img=47" alt="Anna Grant" />
          <Avatar variant="rounded" src="https://i.pravatar.cc/120?img=15" alt="George Park" />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Without image (initials or icon fallback)</span>
        <div className="demo-row">
          <Avatar>AG</Avatar>
          <Avatar color="primary">JP</Avatar>
          <Avatar icon="person" role="img" aria-label="User without a photo" />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Broken image: the &lt;img&gt; is hidden and the alt initial is shown</span>
        <div className="demo-row">
          <Avatar src="./missing.png" alt="Rose Davis" />
          <Avatar variant="rounded" src="./missing.png" alt="Mark Lewis" />
          <Avatar src="./missing.png" alt="Lucy Martin" color="secondary">LM</Avatar>
        </div>
      </div>
    </>
  );
}
