import { useRef, useState } from 'react';
import { Popover } from '@rubenchodev/materix-react/components/popover';

export const title = { en: 'Manual trigger (aria-controls)', es: 'Disparador manual (aria-controls)' };
export const description = {
  en: 'Equivalent of the manual BEM usage: a plain `<button>` with its own `aria-controls`, `aria-haspopup` and `aria-expanded`, and a controlled Popover named by its heading via `aria-labelledby`. Clicks on an element whose `aria-controls` points to the popover never count as "outside".',
  es: 'Equivalente al uso BEM manual: un `<button>` normal con sus propios `aria-controls`, `aria-haspopup` y `aria-expanded`, y un Popover controlado nombrado por su encabezado con `aria-labelledby`. Los clics en un elemento cuyo `aria-controls` apunta al popover nunca cuentan como "fuera".',
};

export default function Demo() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  return (
    <div className="demo-row">
      <button
        ref={triggerRef}
        type="button"
        className="mtx-button mtx-button--outlined"
        aria-haspopup="dialog"
        aria-controls={open ? 'popover-manual' : undefined}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        Open (aria-controls)
      </button>
      <Popover
        id="popover-manual"
        open={open}
        anchorEl={triggerRef}
        onClose={() => setOpen(false)}
        aria-labelledby="popover-manual-title"
        className="mtx-p-2"
      >
        <h3 className="mtx-typography--subtitle2" id="popover-manual-title">
          Full markup
        </h3>
        <p className="mtx-typography--body2">Triggered through aria-controls.</p>
      </Popover>
    </div>
  );
}
