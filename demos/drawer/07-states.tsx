import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Drawer, useDrawer } from '@rubenchodev/materix-react/components/drawer';

export const title = { en: 'States', es: 'Estados' };
export const description = {
  en: 'Prevent implicit closing with `disableBackdropClick` (neither the backdrop nor a click outside closes it) and `disableEscapeKeyDown`; `hideBackdrop` removes the backdrop. The trigger carries `aria-controls` and `aria-expanded`; the status line shows the `reason` received by `onClose`.',
  es: 'Impide el cierre implícito con `disableBackdropClick` (ni el fondo ni un clic fuera lo cierran) y `disableEscapeKeyDown`; `hideBackdrop` quita el fondo. El disparador lleva `aria-controls` y `aria-expanded`; la línea de estado muestra el `reason` que recibe `onClose`.',
};

export default function Demo() {
  const [last, setLast] = useState('—');
  const locked = useDrawer({ onClose: setLast });
  const plain = useDrawer({ onClose: setLast });
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Button variant="outlined" {...locked.getTriggerProps({ action: 'open' })}>
          Explicit close only
        </Button>
        <Button variant="outlined" {...plain.getTriggerProps({ action: 'open' })}>
          No backdrop
        </Button>
        <Button variant="outlined" {...plain.getTriggerProps()}>
          Toggle without backdrop
        </Button>
      </div>
      <p className="demo-status" role="status">
        Last close reason: {last}
      </p>

      <Drawer
        {...locked.drawerProps}
        title="Unsaved changes"
        disableBackdropClick
        disableEscapeKeyDown
        closeButton={false}
        padded
      >
        <p>Neither Escape nor the backdrop closes this panel. Use the buttons.</p>
        <div className="demo-row">
          <Button data-mtx-drawer-close>Discard</Button>
          <Button variant="contained" data-mtx-drawer-close>
            Save
          </Button>
        </div>
      </Drawer>

      <Drawer {...plain.drawerProps} anchor="right" hideBackdrop title="No backdrop" padded>
        <p>No dark overlay; a click outside the panel still closes it.</p>
      </Drawer>
    </div>
  );
}
