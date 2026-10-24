import { useState } from 'react';
import { Avatar, AvatarGroup, type AvatarColor } from '@rubenchodev/materix-react/components/avatar';
import { Button } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'Controlled usage', es: 'Uso controlado' };
export const description = {
  en: 'In React the group recalculates on every render: `max`, `total` and the children replace the vanilla `max`/`total` setters and `refresh()`. Avatar and AvatarGroup emit no events; the log shows each change and the resulting state.',
  es: 'En React el grupo se recalcula en cada render: `max`, `total` y los hijos sustituyen a los setters `max`/`total` y a `refresh()` de vanilla. Avatar y AvatarGroup no emiten eventos; el registro muestra cada cambio y el estado resultante.',
};

const colors: AvatarColor[] = ['primary', 'secondary', 'success', 'info', 'warning', 'error'];

export default function Demo() {
  const [state, setState] = useState<{ max: number; total: number | null; count: number }>({ max: 5, total: null, count: 6 });
  const [log, setLog] = useState<string[]>([]);
  const apply = (call: string, patch: Partial<typeof state>) => {
    const next = { ...state, ...patch };
    setState(next);
    const total = Math.max(next.total ?? next.count, next.count);
    const visible = total <= next.max ? next.count : Math.max(1, next.max - 1);
    setLog((lines) => [...lines, `${call} → max: ${next.max}, total: ${total}, visible: ${visible}`].slice(-6));
  };
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <AvatarGroup max={state.max} total={state.total} label="Team">
          {Array.from({ length: state.count }, (_, i) => (
            <Avatar key={i} color={colors[i % colors.length]}>
              {String.fromCharCode(65 + (i % 26))}
            </Avatar>
          ))}
        </AvatarGroup>
      </div>
      <div className="demo-row">
        <Button variant="outlined" onClick={() => apply('max = 3', { max: 3 })}>max = 3</Button>
        <Button variant="outlined" onClick={() => apply('max = 5', { max: 5 })}>max = 5</Button>
        <Button variant="outlined" onClick={() => apply('total = 20', { total: 20 })}>total = 20</Button>
        <Button variant="outlined" onClick={() => apply('total = null', { total: null })}>total = null</Button>
        <Button variant="outlined" onClick={() => apply('add avatar', { count: state.count + 1 })}>Add avatar</Button>
      </div>
      <pre className="demo-log" aria-live="polite">{log.join('\n')}</pre>
    </div>
  );
}
