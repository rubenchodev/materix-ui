import { useState } from 'react';
import { Chip } from '@rubenchodev/materix-react/components/chip';

export const title = { en: 'Filters', es: 'Filtros' };
export const description = {
  en: 'Clickable chips that toggle between `outlined` and `primary`, with `aria-pressed` as the accessible state.',
  es: 'Chips clicables que alternan entre `outlined` y `primary`, con `aria-pressed` como estado accesible.',
};

const FILTERS = ['Open', 'In review', 'Closed', 'Blocked'];

export default function Demo() {
  const [active, setActive] = useState<string[]>(['Open']);
  const toggle = (name: string) =>
    setActive((current) => (current.includes(name) ? current.filter((item) => item !== name) : [...current, name]));
  return (
    <div className="demo-stack">
      <div className="demo-row" role="group" aria-label="Filter issues">
        {FILTERS.map((name) => {
          const pressed = active.includes(name);
          return (
            <Chip
              key={name}
              label={name}
              color={pressed ? 'primary' : 'default'}
              variant={pressed ? 'filled' : 'outlined'}
              aria-pressed={pressed}
              onClick={() => toggle(name)}
            />
          );
        })}
      </div>
      <p className="demo-status" aria-live="polite">
        Active filters: {active.join(', ') || 'none'}
      </p>
    </div>
  );
}
