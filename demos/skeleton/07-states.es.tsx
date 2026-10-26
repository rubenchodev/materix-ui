import { useState } from 'react';
import { Avatar } from '@rubenchodev/materix-react/components/avatar';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Skeleton, SkeletonRegion } from '@rubenchodev/materix-react/components/skeleton';
import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'States', es: 'Estados' };
export const description = {
  en: '`SkeletonRegion` shows its `placeholder` while `loading` and its children afterwards, syncing `data-loading` and `aria-busy` (the React equivalent of `Materix.skeleton.set()`). With `aria-live="polite"` the content is announced when loading finishes.',
  es: '`SkeletonRegion` muestra su `placeholder` mientras `loading` y sus hijos después, sincronizando `data-loading` y `aria-busy` (el equivalente React de `Materix.skeleton.set()`). Con `aria-live="polite"` el contenido se anuncia al terminar la carga.',
};

const row = { className: 'mtx-d-flex mtx-align-items-center mtx-gap-2' };

export default function Demo() {
  const [loading, setLoading] = useState(true);
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Button variant="outlined" aria-controls="skeleton-region" onClick={() => setLoading((value) => !value)}>
          Alternar carga
        </Button>
      </div>
      <SkeletonRegion
        id="skeleton-region"
        className="demo-fixed-width"
        aria-live="polite"
        loading={loading}
        placeholderProps={row}
        contentProps={row}
        placeholder={
          <>
            <Skeleton variant="circular" width={40} height={40} />
            <div className="mtx-flex-1">
              <Skeleton width="60%" />
              <Skeleton width="40%" />
            </div>
          </>
        }
      >
        <Avatar color="secondary">LM</Avatar>
        <div>
          <Typography variant="body1" component="div">Lucía Martín</Typography>
          <Typography variant="body2" color="text-secondary" component="div">Diseñadora de producto</Typography>
        </div>
      </SkeletonRegion>
    </div>
  );
}
