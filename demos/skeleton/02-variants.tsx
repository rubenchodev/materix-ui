import { Skeleton } from '@rubenchodev/materix-react/components/skeleton';

export const title = { en: 'Variants', es: 'Variantes' };
export const description = {
  en: 'Four shapes, as in MUI: `text` (default, scaled down to 60% of the line height), `circular`, `rectangular` (no radius) and `rounded` (4px radius).',
  es: 'Cuatro formas, como en MUI: `text` (por defecto, reducida al 60 % de la altura de línea), `circular`, `rectangular` (sin radio) y `rounded` (radio de 4px).',
};

export default function Demo() {
  return (
    <div className="demo-grid-4">
      <div className="demo-group">
        <span className="demo-label">text</span>
        <Skeleton variant="text" />
      </div>
      <div className="demo-group">
        <span className="demo-label">circular</span>
        <Skeleton variant="circular" width={56} height={56} />
      </div>
      <div className="demo-group">
        <span className="demo-label">rectangular</span>
        <Skeleton variant="rectangular" height={56} />
      </div>
      <div className="demo-group">
        <span className="demo-label">rounded</span>
        <Skeleton variant="rounded" height={56} />
      </div>
    </div>
  );
}
