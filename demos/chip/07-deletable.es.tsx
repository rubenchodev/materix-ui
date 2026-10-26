import { useState } from 'react';
import { Chip } from '@rubenchodev/materix-react/components/chip';
import { Button } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'Deletable', es: 'Eliminables' };
export const description = {
  en: '`onDelete` is called on click or Delete/Backspace; the chip does not remove itself, your state does.',
  es: '`onDelete` se invoca con clic o Supr/Retroceso; el chip no se elimina solo, lo hace tu estado.',
};

const INITIAL = ['React', 'Vue', 'Svelte', 'Angular'];

export default function Demo() {
  const [tags, setTags] = useState(INITIAL);
  return (
    <div className="demo-stack">
      <div className="demo-row">
        {tags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            deleteLabel={`Eliminar ${tag}`}
            onDelete={() => setTags((current) => current.filter((item) => item !== tag))}
          />
        ))}
      </div>
      <div className="demo-row">
        <Button variant="text" onClick={() => setTags(INITIAL)}>
          Restaurar etiquetas
        </Button>
      </div>
    </div>
  );
}
