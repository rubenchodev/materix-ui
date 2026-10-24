import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Drawer } from '@rubenchodev/materix-react/components/drawer';
import type { DrawerCloseReason } from '@rubenchodev/materix-react/components/drawer';

export const title = { en: 'States', es: 'Estados' };
export const description = {
  en: 'Prevent implicit closing with `disableBackdropClick` (neither the backdrop nor a click outside closes it) and `disableEscapeKeyDown`; `hideBackdrop` removes the backdrop. The trigger carries `aria-controls` and `aria-expanded`; the status line shows the `reason` received by `onClose`.',
  es: 'Impide el cierre implícito con `disableBackdropClick` (ni el fondo ni un clic fuera lo cierran) y `disableEscapeKeyDown`; `hideBackdrop` quita el fondo. El disparador lleva `aria-controls` y `aria-expanded`; la línea de estado muestra el `reason` que recibe `onClose`.',
};

export default function Demo() {
  const [locked, setLocked] = useState(false);
  const [plain, setPlain] = useState(false);
  const [last, setLast] = useState<string>('—');
  const close = (reason: DrawerCloseReason | 'button') => {
    setLast(reason);
    setPlain(false);
  };
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Button variant="outlined" onClick={() => setLocked(true)}>
          Explicit close only
        </Button>
        <Button variant="outlined" onClick={() => setPlain(true)}>
          No backdrop
        </Button>
        <Button
          variant="outlined"
          aria-controls="drawer-states-nobackdrop"
          aria-expanded={plain}
          onClick={() => setPlain((value) => !value)}
        >
          Toggle without backdrop
        </Button>
      </div>
      <p className="demo-status" role="status">
        Last close reason: {last}
      </p>

      <Drawer
        open={locked}
        title="Unsaved changes"
        disableBackdropClick
        disableEscapeKeyDown
        closeButton={false}
        padded
        onClose={(_event, reason) => {
          setLast(reason);
          setLocked(false);
        }}
      >
        <p>Neither Escape nor the backdrop closes this panel. Use the buttons.</p>
        <div className="demo-row">
          <Button data-mtx-drawer-close>Discard</Button>
          <Button variant="contained" data-mtx-drawer-close>
            Save
          </Button>
        </div>
      </Drawer>

      <Drawer
        id="drawer-states-nobackdrop"
        open={plain}
        anchor="right"
        hideBackdrop
        title="No backdrop"
        padded
        onClose={(_event, reason) => close(reason)}
      >
        <p>No dark overlay; a click outside the panel still closes it.</p>
      </Drawer>
    </div>
  );
}
