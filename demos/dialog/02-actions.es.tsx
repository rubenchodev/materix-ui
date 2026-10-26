import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Dialog } from '@rubenchodev/materix-react/components/dialog';

export const title = { en: 'With actions', es: 'Con acciones' };
export const description = {
  en: '`actions` wraps the buttons in a `DialogActions` placed at the end of the panel, outside the content. `description` generates a `DialogContentText` linked with `aria-describedby`. The main action uses `contained` and the secondary one `text`.',
  es: '`actions` envuelve los botones en un `DialogActions` al final del panel, fuera del contenido. `description` genera un `DialogContentText` enlazado con `aria-describedby`. La acción principal usa `contained` y la secundaria `text`.',
};

export default function Demo() {
  const [open, setOpen] = useState<'actions' | 'description' | null>(null);
  const close = () => setOpen(null);
  return (
    <div className="demo-row">
      <Button variant="contained" onClick={() => setOpen('actions')}>
        Abrir con acciones
      </Button>
      <Button variant="outlined" onClick={() => setOpen('description')}>
        Con descripción
      </Button>
      <Dialog
        open={open === 'actions'}
        onClose={close}
        title="¿Activar la sincronización?"
        actions={
          <>
            <Button onClick={close}>Cancelar</Button>
            <Button variant="contained" onClick={close}>
              Activar
            </Button>
          </>
        }
      >
        Tus documentos se copiarán en la nube y estarán disponibles en todos tus dispositivos.
      </Dialog>
      <Dialog
        open={open === 'description'}
        onClose={close}
        maxWidth="sm"
        title="¿Descartar el borrador?"
        description="El mensaje se eliminará y no podrás recuperarlo."
        actions={
          <>
            <Button onClick={close} data-dialog-autofocus>
              Cancelar
            </Button>
            <Button variant="contained" onClick={close}>
              Descartar
            </Button>
          </>
        }
      />
    </div>
  );
}
