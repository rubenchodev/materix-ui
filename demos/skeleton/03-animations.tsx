import { Skeleton, type SkeletonAnimation } from '@rubenchodev/materix-react/components/skeleton';

export const title = { en: 'Animations', es: 'Animaciones' };
export const description = {
  en: '`animation="pulse"` (default, the opacity oscillates), `"wave"` (a band sweeps across the block) or `false` (static). With `prefers-reduced-motion: reduce` the animation is turned off automatically.',
  es: '`animation="pulse"` (por defecto, la opacidad oscila), `"wave"` (una banda recorre el bloque) o `false` (estático). Con `prefers-reduced-motion: reduce` la animación se desactiva automáticamente.',
};

const animations: SkeletonAnimation[] = ['pulse', 'wave', false];

export default function Demo() {
  return (
    <div className="demo-grid-3">
      {animations.map((animation) => (
        <div key={String(animation)} className="demo-group">
          <span className="demo-label">{String(animation)}</span>
          <Skeleton variant="rounded" height={80} animation={animation} />
        </div>
      ))}
    </div>
  );
}
