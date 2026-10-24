import { Avatar } from '@rubenchodev/materix-react/components/avatar';
import { Button } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'Sizes', es: 'Tamaños' };
export const description = {
  en: 'Canonical sizes of 24, 40 and 56px with `size="small|medium|large"`. A number in `size` sets a custom size in pixels.',
  es: 'Tamaños canónicos de 24, 40 y 56px con `size="small|medium|large"`. Un número en `size` fija un tamaño personalizado en píxeles.',
};

const photo = 'https://i.pravatar.cc/120?img=5';

export default function Demo() {
  return (
    <>
      <div className="demo-group">
        <span className="demo-label">Small · 24px</span>
        <div className="demo-row">
          <Avatar size="small" color="primary">S</Avatar>
          <Avatar size="small" src={photo} alt="Anna Grant" />
          <Avatar size="small" variant="rounded" color="secondary">AB</Avatar>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Medium · 40px (default)</span>
        <div className="demo-row">
          <Avatar size="medium" color="primary">M</Avatar>
          <Avatar size="medium" src={photo} alt="Anna Grant" />
          <Avatar size="medium" icon="person" role="img" aria-label="User" />
          <Button variant="outlined">40px button</Button>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Large · 56px</span>
        <div className="demo-row">
          <Avatar size="large" color="primary">L</Avatar>
          <Avatar size="large" src={photo} alt="Anna Grant" />
          <Avatar size="large" icon="person" role="img" aria-label="User" />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Custom · size={'{72}'}</span>
        <div className="demo-row">
          <Avatar size={72} color="secondary">72</Avatar>
          <Avatar size={96} src="https://i.pravatar.cc/200?img=5" alt="Anna Grant" />
        </div>
      </div>
    </>
  );
}
