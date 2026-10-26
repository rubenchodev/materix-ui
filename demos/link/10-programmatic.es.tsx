import { forwardRef, useState, type AnchorHTMLAttributes } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Link, type LinkColor } from '@rubenchodev/materix-react/components/link';

export const title = { en: 'Programmatic usage', es: 'Uso programático' };
export const description = {
  en: '`Link` has no methods of its own: links are created from state, and `component` renders the Link style on your router\'s link (React Router, Next.js…).',
  es: '`Link` no tiene métodos propios: los enlaces se crean desde el estado y `component` aplica el estilo de Link sobre el enlace de tu router (React Router, Next.js…).',
};

/** Simula el `Link` de un router: recibe `to` en lugar de `href`. */
const RouterLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }>(
  function RouterLink({ to, ...props }, ref) {
    return <a ref={ref} href={`#${to}`} {...props} />;
  },
);

interface DynamicLink {
  id: number;
  color: LinkColor;
  underline?: 'always';
}

export default function Demo() {
  const [links, setLinks] = useState<DynamicLink[]>([]);
  const add = (color: LinkColor, underline?: 'always') =>
    setLinks((prev) => [...prev, { id: prev.length + 1, color, underline }]);
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Button variant="outlined" onClick={() => add('primary')}>
          Crear enlace primary
        </Button>
        <Button variant="outlined" onClick={() => add('error', 'always')}>
          Crear enlace error · always
        </Button>
        <Button variant="text" onClick={() => setLinks([])}>
          Limpiar
        </Button>
      </div>
      <div className="demo-row" aria-live="polite">
        <Link component={RouterLink} to="/dashboard">
          Enlace del router
        </Link>
        {links.map(({ id, color, underline }) => (
          <Link key={id} href="#programmatic" color={color} underline={underline}>
            Enlace dinámico {id}
          </Link>
        ))}
      </div>
      <pre className="demo-log">
        {links
          .map(({ id, color, underline }) => `Enlace dinámico ${id} → mtx-link mtx-link--${color} mtx-link--color-${color}${underline ? ` mtx-link--underline-${underline}` : ''}`)
          .join('\n')}
      </pre>
    </div>
  );
}
