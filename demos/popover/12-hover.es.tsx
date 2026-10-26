import { useRef, useState } from 'react';
import { Popover } from '@rubenchodev/materix-react/components/popover';

export const title = { en: 'Mouse over interaction', es: 'Interacción al pasar el ratón' };
export const description = {
  en: 'MUI’s hover pattern: open on `mouseenter`/`focus` and close on `mouseleave`/`blur`, with `disableAutoFocus`, `disableRestoreFocus` and the `mtx-pointer-events-none` utility so the popover never steals the pointer or the focus.',
  es: 'El patrón hover de MUI: abrir en `mouseenter`/`focus` y cerrar en `mouseleave`/`blur`, con `disableAutoFocus`, `disableRestoreFocus` y la utilidad `mtx-pointer-events-none` para que el popover no robe el puntero ni el foco.',
};

export default function Demo() {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLSpanElement>(null);
  return (
    <>
      <div className="demo-row">
        <span
          ref={anchorRef}
          className="mtx-typography--body1"
          tabIndex={0}
          aria-describedby={open ? 'popover-hover' : undefined}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
        >
          Pasa el ratón o enfoca este texto
        </span>
      </div>
      <Popover
        id="popover-hover"
        open={open}
        anchorEl={anchorRef}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        onClose={() => setOpen(false)}
        disableAutoFocus
        disableRestoreFocus
        label="Detalles al pasar el ratón"
        className="mtx-p-2 mtx-pointer-events-none"
      >
        Uso Popover.
      </Popover>
    </>
  );
}
