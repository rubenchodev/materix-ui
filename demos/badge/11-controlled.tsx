import { useState } from 'react';
import { Badge } from '@rubenchodev/materix-react/components/badge';
import { Button } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'Controlled usage', es: 'Uso controlado' };
export const description = {
  en: 'In React the badge is driven by props: `badgeContent` and `invisible` replace the vanilla `content` and `invisible` setters, applying `max` and the zero rule. Badge emits no events; the log shows each change and the resulting state.',
  es: 'En React la insignia se controla con props: `badgeContent` e `invisible` sustituyen a los setters `content` e `invisible` de vanilla, aplicando `max` y la regla del cero. Badge no emite eventos; el registro muestra cada cambio y el estado resultante.',
};

export default function Demo() {
  const [content, setContent] = useState<number | null>(1);
  const [invisible, setInvisible] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const apply = (call: string, next: number | null, hidden: boolean) => {
    setContent(next);
    setInvisible(hidden);
    setLog((lines) => [...lines, `${call} → badgeContent: ${next}, invisible: ${hidden}`].slice(-6));
  };
  return (
    <div className="demo-stack">
      <div className="demo-row mtx-gap-4 mtx-pt-1 mtx-px-1">
        <Badge badgeContent={content} invisible={invisible} max={9} color="primary">
          <span className="material-icons" aria-hidden="true">notifications</span>
        </Badge>
        <Button variant="outlined" onClick={() => apply('badgeContent + 1', (content ?? 0) + 1, invisible)}>
          content + 1
        </Button>
        <Button variant="outlined" onClick={() => apply('badgeContent = 0', 0, invisible)}>
          content = 0
        </Button>
        <Button variant="outlined" onClick={() => apply('badgeContent = null', null, invisible)}>
          content = null
        </Button>
        <Button variant="outlined" onClick={() => apply('invisible = !invisible', content, !invisible)}>
          Toggle invisible
        </Button>
      </div>
      <pre className="demo-log" aria-live="polite">{log.join('\n')}</pre>
    </div>
  );
}
