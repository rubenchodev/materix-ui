import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Stack } from '@rubenchodev/materix-react/components/stack';
import { Pagination, usePagination } from '@rubenchodev/materix-react/components/pagination';

export const title = { en: 'Controlled usage and usePagination', es: 'Uso controlado y usePagination' };
export const description = {
  en: "In controlled mode the parent owns `page`, so external buttons can change it. `usePagination` exposes the MUI hook logic (`items` with `type`, `page`, `selected`, `disabled` and `onClick`) to build a custom UI, here with `Button`.",
  es: "En modo controlado el padre es dueño de `page`, así que unos botones externos pueden cambiarla. `usePagination` expone la lógica del hook de MUI (`items` con `type`, `page`, `selected`, `disabled` y `onClick`) para construir una interfaz propia, aquí con `Button`.",
};

const COUNT = 10;

export default function Demo() {
  const [page, setPage] = useState(1);
  const [log, setLog] = useState<string[]>([]);
  const go = (next: number, source: string) => {
    const clamped = Math.min(Math.max(1, next), COUNT);
    if (clamped === page) return;
    setLog((prev) => [`${source} → page ${clamped} (previous: ${page})`, ...prev].slice(0, 12));
    setPage(clamped);
  };
  const { items } = usePagination({ count: 5, defaultPage: 2 });

  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">Controlled Pagination</span>
        <Pagination
          count={COUNT}
          page={page}
          onChange={(_, next) => go(next, 'onChange (user)')}
          color="primary"
          showFirstButton
          showLastButton
          aria-label="Controlled pagination"
        />
        <Stack direction="row" spacing={1} wrap alignItems="center">
          <Button variant="outlined" size="small" onClick={() => go(page - 1, 'previous')}>
            previous
          </Button>
          <Button variant="outlined" size="small" onClick={() => go(page + 1, 'next')}>
            next
          </Button>
          <Button variant="outlined" size="small" onClick={() => go(7, 'page = 7')}>
            page = 7
          </Button>
          <span className="demo-status">page: {page}</span>
        </Stack>
        <pre className="demo-log" aria-live="polite">
          {log.join('\n')}
        </pre>
      </div>
      <div className="demo-group">
        <span className="demo-label">Custom UI with usePagination</span>
        <Stack component="nav" direction="row" spacing={1} wrap alignItems="center" aria-label="Custom pagination">
          {items.map(({ type, page: target, selected, disabled, onClick }, index) =>
            type === 'start-ellipsis' || type === 'end-ellipsis' ? (
              <span key={`${type}-${index}`} aria-hidden="true">
                …
              </span>
            ) : (
              <Button
                key={`${type}-${index}`}
                size="small"
                variant={selected ? 'contained' : 'text'}
                disabled={disabled}
                aria-current={selected ? 'page' : undefined}
                onClick={onClick}
              >
                {type === 'page' ? target : type}
              </Button>
            ),
          )}
        </Stack>
      </div>
    </div>
  );
}
