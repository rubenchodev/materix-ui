import { Avatar } from '@rubenchodev/materix-react/components/avatar';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Skeleton } from '@rubenchodev/materix-react/components/skeleton';

export const title = { en: 'With children', es: 'Con hijos' };
export const description = {
  en: 'When the skeleton wraps content, it takes its exact size and hides it (`visibility: hidden`). Useful to avoid repeating dimensions: an Avatar or a Button inside becomes its own placeholder.',
  es: 'Cuando el skeleton envuelve contenido, toma su tamaño exacto y lo oculta (`visibility: hidden`). Útil para no repetir dimensiones: un Avatar o un Button dentro se convierte en su propio placeholder.',
};

export default function Demo() {
  return (
    <div className="demo-row">
      <Skeleton component="div" variant="circular">
        <Avatar icon="person" />
      </Skeleton>
      <Skeleton component="div" variant="rounded">
        <Button variant="contained" tabIndex={-1}>Guardar cambios</Button>
      </Skeleton>
      <Skeleton component="div" className="mtx-typography--h5">
        Un título de longitud real
      </Skeleton>
    </div>
  );
}
