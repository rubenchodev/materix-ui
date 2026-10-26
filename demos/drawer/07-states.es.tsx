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
          Solo cierre explícito
        </Button>
        <Button variant="outlined" {...plain.getTriggerProps({ action: 'open' })}>
          Sin fondo
        </Button>
        <Button variant="outlined" {...plain.getTriggerProps()}>
          Alternar sin fondo
        </Button>
      </div>
      <p className="demo-status" role="status">
        Último motivo de cierre: {last}
      </p>

      <Drawer
        {...locked.drawerProps}
        title="Cambios sin guardar"
        disableBackdropClick
        disableEscapeKeyDown
        closeButton={false}
        padded
      >
        <p>Ni Escape ni el fondo cierran este panel. Usa los botones.</p>
        <div className="demo-row">
          <Button data-mtx-drawer-close>Descartar</Button>
          <Button variant="contained" data-mtx-drawer-close>
            Guardar
          </Button>
        </div>
      </Drawer>

      <Drawer {...plain.drawerProps} anchor="right" hideBackdrop title="Sin fondo" padded>
        <p>Sin capa oscura; un clic fuera del panel sigue cerrándolo.</p>
      </Drawer>
    </div>
  );
}
