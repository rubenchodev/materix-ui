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
        Open with actions
      </Button>
      <Button variant="outlined" onClick={() => setOpen('description')}>
        With description
      </Button>
      <Dialog
        open={open === 'actions'}
        onClose={close}
        title="Turn on sync?"
        actions={
          <>
            <Button onClick={close}>Cancel</Button>
            <Button variant="contained" onClick={close}>
              Turn on
            </Button>
          </>
        }
      >
        Your documents will be copied to the cloud and available on all your devices.
      </Dialog>
      <Dialog
        open={open === 'description'}
        onClose={close}
        maxWidth="sm"
        title="Discard draft?"
        description="The message will be deleted and you will not be able to recover it."
        actions={
          <>
            <Button onClick={close} data-dialog-autofocus>
              Cancel
            </Button>
            <Button variant="contained" onClick={close}>
              Discard
            </Button>
          </>
        }
      />
    </div>
  );
}
