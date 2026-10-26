import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Dialog } from '@rubenchodev/materix-react/components/dialog';

export const title = { en: 'Modal behavior', es: 'Comportamiento modal' };
export const description = {
  en: 'By default a backdrop click and Escape close the dialog. `disableBackdropClose` and `disableEscapeKeyDown` force an explicit choice. Page scrolling is locked while it is open.',
  es: 'Por defecto un clic en el fondo y Escape cierran el diálogo. `disableBackdropClose` y `disableEscapeKeyDown` obligan a elegir una acción explícita. El scroll de la página se bloquea mientras está abierto.',
};

export default function Demo() {
  const [open, setOpen] = useState<'backdrop' | 'strict' | null>(null);
  const close = () => setOpen(null);
  return (
    <div className="demo-row">
      <Button variant="outlined" onClick={() => setOpen('backdrop')}>
        Sin cierre por fondo
      </Button>
      <Button variant="outlined" onClick={() => setOpen('strict')}>
        Sin fondo ni Escape
      </Button>
      <Dialog
        open={open === 'backdrop'}
        onClose={close}
        disableBackdropClose
        maxWidth="sm"
        title="Cambios sin guardar"
        actions={
          <>
            <Button onClick={close}>Descartar</Button>
            <Button variant="contained" onClick={close}>
              Guardar
            </Button>
          </>
        }
      >
        Hacer clic fuera del panel no lo cierra; Escape sí.
      </Dialog>
      <Dialog
        open={open === 'strict'}
        onClose={close}
        disableBackdropClose
        disableEscapeKeyDown
        maxWidth="sm"
        title="Acepta para continuar"
        actions={
          <Button variant="contained" onClick={close}>
            Aceptar
          </Button>
        }
      >
        Ni el fondo ni Escape cierran este diálogo: solo los botones.
      </Dialog>
    </div>
  );
}
