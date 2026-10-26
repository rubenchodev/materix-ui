import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Dialog } from '@rubenchodev/materix-react/components/dialog';

export const title = { en: 'Destructive confirmation', es: 'Confirmación destructiva' };
export const description = {
  en: 'For irreversible actions phrase the title as a question, explain the consequence and color the action with `color="error"`. `role="alertdialog"` marks the urgency and `data-dialog-autofocus` sends the initial focus to "Cancel", the safe option.',
  es: 'Para acciones irreversibles formula el título como pregunta, explica la consecuencia y colorea la acción con `color="error"`. `role="alertdialog"` marca la urgencia y `data-dialog-autofocus` lleva el foco inicial a "Cancelar", la opción segura.',
};

export default function Demo() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('');
  const close = () => setOpen(false);
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Button variant="contained" color="error" onClick={() => setOpen(true)}>
          Eliminar proyecto
        </Button>
      </div>
      <p className="demo-status" role="status">
        {status}
      </p>
      <Dialog
        open={open}
        onClose={close}
        role="alertdialog"
        maxWidth="sm"
        title="¿Eliminar el proyecto?"
        description="Se borrarán sus 24 archivos y no podrás recuperarlos."
        actions={
          <>
            <Button onClick={close} data-dialog-autofocus>
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                setStatus('Proyecto eliminado');
                close();
              }}
            >
              Eliminar
            </Button>
          </>
        }
      />
    </div>
  );
}
