import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import {
  Skeleton,
  SkeletonRegion,
  type SkeletonAnimation,
  type SkeletonVariant,
} from '@rubenchodev/materix-react/components/skeleton';

export const title = { en: 'Controlled usage', es: 'Uso controlado' };
export const description = {
  en: 'The `variant` and `animation` props replace the vanilla `setVariant()` and `setAnimation()`; `SkeletonRegion` calls `onChange({ loading })` when `loading` changes (the `mtx:skeleton:change` event).',
  es: 'Las props `variant` y `animation` sustituyen a `setVariant()` y `setAnimation()` de vanilla; `SkeletonRegion` llama a `onChange({ loading })` cuando cambia `loading` (el evento `mtx:skeleton:change`).',
};

const variants: SkeletonVariant[] = ['rounded', 'circular', 'rectangular', 'text'];
const animations: SkeletonAnimation[] = ['pulse', 'wave', false];

export default function Demo() {
  const [v, setV] = useState(0);
  const [a, setA] = useState(0);
  const [loading, setLoading] = useState(true);
  const [log, setLog] = useState<string[]>([]);
  const write = (line: string) => setLog((lines) => [line, ...lines].slice(0, 6));

  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Skeleton variant={variants[v]} animation={animations[a]} width={120} height={120} />
        <SkeletonRegion
          loading={loading}
          onChange={({ loading: value }) => write(`onChange → loading = ${value}`)}
          placeholder={<Skeleton width={160} />}
        >
          Contenido cargado
        </SkeletonRegion>
      </div>
      <div className="demo-row">
        <Button
          variant="outlined"
          onClick={() => {
            const next = (v + 1) % variants.length;
            setV(next);
            write(`variant="${variants[next]}"`);
          }}
        >
          Cambiar variante
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            const next = (a + 1) % animations.length;
            setA(next);
            write(`animation=${JSON.stringify(animations[next])}`);
          }}
        >
          Cambiar animación
        </Button>
        <Button variant="outlined" onClick={() => setLoading((value) => !value)}>
          Alternar carga
        </Button>
      </div>
      <pre className="demo-log" aria-live="polite">{log.join('\n')}</pre>
    </div>
  );
}
