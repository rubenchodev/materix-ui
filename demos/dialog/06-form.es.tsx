import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Dialog, DialogActions, DialogContent, DialogContentText } from '@rubenchodev/materix-react/components/dialog';
import { TextField } from '@rubenchodev/materix-react/components/text-field';

export const title = { en: 'Form inside a dialog', es: 'Formulario dentro de un diálogo' };
export const description = {
  en: 'A `<form>` holds the fields and is submitted from the actions with `type="submit" form="…"`. Focus goes to the first field, or to the one marked with `data-dialog-autofocus` (in "Subscribe", the email, because the name is already filled in), and `Tab` never leaves the panel. If the content starts with a field, space is reserved so the floating label is not clipped.',
  es: 'Un `<form>` contiene los campos y se envía desde las acciones con `type="submit" form="…"`. El foco va al primer campo, o al marcado con `data-dialog-autofocus` (en "Suscribirse", el email, porque el nombre ya está relleno), y `Tab` nunca sale del panel. Si el contenido empieza por un campo, se reserva espacio para que el label flotante no se recorte.',
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
    setStatus(`Suscrito: ${email}`);
    close();
  };

  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Button variant="contained" onClick={() => setOpen('subscribe')}>
          Suscribirse
        </Button>
        <Button variant="outlined" onClick={() => setOpen('rename')}>
          Renombrar (campo primero)
        </Button>
      </div>
      <p className="demo-status" role="status">
        {status}
      </p>
      <Dialog open={open === 'subscribe'} onClose={close} maxWidth="sm" title="Suscríbete al boletín">
        <DialogContent>
          <form className="demo-stack" id="dlg-form-el" onSubmit={handleSubmit}>
            <DialogContentText>Recibe una vez al mes las novedades de Materix UI.</DialogContentText>
            <TextField label="Nombre" name="name" defaultValue="Lucía" required fullWidth />
            <TextField label="Correo electrónico" type="email" name="email" required fullWidth inputProps={AUTOFOCUS} />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>Cancelar</Button>
          <Button variant="contained" type="submit" form="dlg-form-el">
            Suscribirse
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={open === 'rename'}
        onClose={close}
        maxWidth="sm"
        title="Renombrar archivo"
        actions={
          <>
            <Button onClick={close}>Cancelar</Button>
            <Button variant="contained" onClick={close}>
              Renombrar
            </Button>
          </>
        }
      >
        <TextField label="Nombre del archivo" defaultValue="informe-trimestral.pdf" fullWidth inputProps={AUTOFOCUS} />
      </Dialog>
    </div>
  );
}
