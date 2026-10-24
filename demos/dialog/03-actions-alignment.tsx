import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Dialog, DialogActions } from '@rubenchodev/materix-react/components/dialog';

export const title = { en: 'Actions alignment', es: 'Alineación de las acciones' };
export const description = {
  en: 'As in MUI, actions go on the right by default (`end`). Use `align="start|center|end|between"` on `DialogActions`, or `actionsAlign` for the whole dialog; `between` separates an auxiliary action on the left from the main ones.',
  es: 'Como en MUI, las acciones van a la derecha por defecto (`end`). Usa `align="start|center|end|between"` en `DialogActions`, o `actionsAlign` para todo el diálogo; `between` separa una acción auxiliar a la izquierda de las principales.',
};

type Align = 'end' | 'start' | 'center' | 'between';

export default function Demo() {
  const [open, setOpen] = useState<Align | null>(null);
  const close = () => setOpen(null);
  return (
    <div className="demo-row">
      {(['end', 'start', 'center', 'between'] as Align[]).map((align) => (
        <Button key={align} variant="outlined" onClick={() => setOpen(align)}>
          {align === 'end' ? 'end (default)' : align}
        </Button>
      ))}
      <Dialog
        open={open === 'end'}
        onClose={close}
        maxWidth="sm"
        title="Actions on the right"
        description="Without props, the actions are aligned to the end of the panel."
        actions={
          <>
            <Button onClick={close}>Cancel</Button>
            <Button variant="contained" onClick={close}>
              OK
            </Button>
          </>
        }
      />
      <Dialog
        open={open === 'start'}
        onClose={close}
        maxWidth="sm"
        actionsAlign="start"
        title="Actions at the start"
        description='actionsAlign="start" on the dialog applies to its actions.'
        actions={
          <>
            <Button variant="contained" onClick={close}>
              OK
            </Button>
            <Button onClick={close}>Cancel</Button>
          </>
        }
      />
      <Dialog
        open={open === 'center'}
        onClose={close}
        maxWidth="sm"
        title="Centered action"
        description="Useful for confirmations with a single action."
      >
        <DialogActions align="center">
          <Button variant="contained" onClick={close}>
            Got it
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={open === 'between'}
        onClose={close}
        maxWidth="sm"
        title="Export report"
        description="The auxiliary action stays on the left and the main ones on the right."
      >
        <DialogActions align="between">
          <Button startIcon="help_outline">Help</Button>
          <div className="mtx-d-flex mtx-gap-1">
            <Button onClick={close}>Cancel</Button>
            <Button variant="contained" onClick={close}>
              Export
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}
