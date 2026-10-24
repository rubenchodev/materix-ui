import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@rubenchodev/materix-react/components/dialog';

export const title = { en: 'Composition', es: 'Composición' };
export const description = {
  en: 'Compose `DialogTitle`, `DialogContent`, `DialogContentText` and `DialogActions` for full control: the title names the dialog and the first text describes it, with no ids to write. `sticky` pins the title and the actions.',
  es: 'Compón `DialogTitle`, `DialogContent`, `DialogContentText` y `DialogActions` para un control total: el título da nombre al diálogo y el primer texto lo describe, sin escribir ids. `sticky` fija el título y las acciones.',
};

export default function Demo() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <div className="demo-row">
      <Button variant="contained" onClick={() => setOpen(true)}>
        Open composed dialog
      </Button>
      <Dialog open={open} onClose={close} maxWidth="sm">
        <DialogTitle sticky>Composed structure</DialogTitle>
        <DialogContent>
          <DialogContentText>
            DialogTitle names the dialog (aria-labelledby) and the first DialogContentText describes it
            (aria-describedby), with no ids to write by hand.
          </DialogContentText>
        </DialogContent>
        <DialogActions sticky>
          <Button onClick={close}>Cancel</Button>
          <Button variant="contained" onClick={close}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
