import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Dialog, DialogActions, DialogContent, DialogContentText } from '@rubenchodev/materix-react/components/dialog';
import { TextField } from '@rubenchodev/materix-react/components/text-field';

export const title = { en: 'Form inside a dialog', es: 'Formulario dentro de un diálogo' };
export const description = {
  en: 'A `<form>` holds the fields and is submitted from the actions with `type="submit" form="…"`. Focus goes to the first field, or to the one marked with `data-dialog-autofocus` (in "Subscribe", the email, because the name is already filled in), and `Tab` never leaves the panel. If the content starts with a field, space is reserved so the floating label is not clipped.',
  es: 'Un `<form>` contiene los campos y se envía desde las acciones con `type="submit" form="…"`. El foco va al primer campo, o al marcado con `data-dialog-autofocus` (en "Subscribe", el email, porque el nombre ya está relleno), y `Tab` nunca sale del panel. Si el contenido empieza por un campo, se reserva espacio para que el label flotante no se recorte.',
};

const AUTOFOCUS = { 'data-dialog-autofocus': '' };

export default function Demo() {
  const [open, setOpen] = useState<'subscribe' | 'rename' | null>(null);
  const [status, setStatus] = useState('');
  const close = () => setOpen(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    setStatus(`Subscribed: ${email}`);
    close();
  };

  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Button variant="contained" onClick={() => setOpen('subscribe')}>
          Subscribe
        </Button>
        <Button variant="outlined" onClick={() => setOpen('rename')}>
          Rename (field first)
        </Button>
      </div>
      <p className="demo-status" role="status">
        {status}
      </p>
      <Dialog open={open === 'subscribe'} onClose={close} maxWidth="sm" title="Subscribe to the newsletter">
        <DialogContent>
          <form className="demo-stack" id="dlg-form-el" onSubmit={handleSubmit}>
            <DialogContentText>Get the Materix UI news once a month.</DialogContentText>
            <TextField label="Name" name="name" defaultValue="Jane" required fullWidth />
            <TextField label="Email" type="email" name="email" required fullWidth inputProps={AUTOFOCUS} />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>Cancel</Button>
          <Button variant="contained" type="submit" form="dlg-form-el">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={open === 'rename'}
        onClose={close}
        maxWidth="sm"
        title="Rename file"
        actions={
          <>
            <Button onClick={close}>Cancel</Button>
            <Button variant="contained" onClick={close}>
              Rename
            </Button>
          </>
        }
      >
        <TextField label="File name" defaultValue="quarterly-report.pdf" fullWidth inputProps={AUTOFOCUS} />
      </Dialog>
    </div>
  );
}
