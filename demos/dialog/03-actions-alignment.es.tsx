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
          {align === 'end' ? 'end (predeterminado)' : align}
        </Button>
      ))}
      <Dialog
        open={open === 'end'}
        onClose={close}
        maxWidth="sm"
        title="Acciones a la derecha"
        description="Sin props, las acciones se alinean al final del panel."
        actions={
          <>
            <Button onClick={close}>Cancelar</Button>
            <Button variant="contained" onClick={close}>
              Aceptar
            </Button>
          </>
        }
      />
      <Dialog
        open={open === 'start'}
        onClose={close}
        maxWidth="sm"
        actionsAlign="start"
        title="Acciones al inicio"
        description='actionsAlign="start" en el diálogo se aplica a sus acciones.'
        actions={
          <>
            <Button variant="contained" onClick={close}>
              Aceptar
            </Button>
            <Button onClick={close}>Cancelar</Button>
          </>
        }
      />
      <Dialog
        open={open === 'center'}
        onClose={close}
        maxWidth="sm"
        title="Acción centrada"
        description="Útil para confirmaciones con una sola acción."
      >
        <DialogActions align="center">
          <Button variant="contained" onClick={close}>
            Entendido
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={open === 'between'}
        onClose={close}
        maxWidth="sm"
        title="Exportar informe"
        description="La acción auxiliar queda a la izquierda y las principales a la derecha."
      >
        <DialogActions align="between">
          <Button startIcon="help_outline">Ayuda</Button>
          <div className="mtx-d-flex mtx-gap-1">
            <Button onClick={close}>Cancelar</Button>
            <Button variant="contained" onClick={close}>
              Exportar
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}
