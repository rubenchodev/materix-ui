import { Skeleton } from '@rubenchodev/materix-react/components/skeleton';

export const title = { en: 'Paragraphs', es: 'Párrafos' };
export const description = {
  en: '`lines={3}` generates several lines of text; the last one is shorter (60% by default, configurable with `lastWidth`).',
  es: '`lines={3}` genera varias líneas de texto; la última es más corta (60 % por defecto, configurable con `lastWidth`).',
};

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">3 lines</span>
        <Skeleton lines={3} />
      </div>
      <div className="demo-group">
        <span className="demo-label">5 lines · wave · last one at 30%</span>
        <Skeleton lines={5} animation="wave" lastWidth="30%" />
      </div>
    </div>
  );
}
