import { useState } from 'react';
import { Popover, usePopover } from '@rubenchodev/materix-react/components/popover';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Checkbox } from '@rubenchodev/materix-react/components/checkbox';
import { Dialog } from '@rubenchodev/materix-react/components/dialog';

export const title = { en: 'Dialog from a popover', es: 'Dialog desde un popover' };
export const description = {
  en: 'A button inside the popover opens a Dialog. Interacting with the dialog does not close the popover; the first Escape closes only the dialog (focus returns to the button) and the second one closes the popover.',
  es: 'Un botón dentro del popover abre un Dialog. Interactuar con el diálogo no cierra el popover; el primer Escape cierra solo el diálogo (el foco vuelve al botón) y el segundo cierra el popover.',
};

export default function Demo() {
  const popover = usePopover();
  const [dialogOpen, setDialogOpen] = useState(false);
  const closeDialog = () => setDialogOpen(false);
  return (
    <div className="demo-row">
      <Button variant="outlined" startIcon="tune" {...popover.getTriggerProps()}>
        Opciones
      </Button>
      <Popover {...popover.popoverProps} label="Opciones" className="mtx-p-2">
        <Checkbox label="Solo los míos" defaultChecked />
        <div className="mtx-d-flex mtx-justify-content-end mtx-mt-1">
          <Button variant="text" onClick={() => setDialogOpen(true)}>
            Avanzado…
          </Button>
        </div>
      </Popover>
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        maxWidth="xs"
        title="Opciones avanzadas"
        description="Pulsa Escape una vez para cerrar este diálogo; el popover sigue abierto."
        actions={
          <Button variant="text" onClick={closeDialog}>
            Cerrar
          </Button>
        }
      />
    </div>
  );
}
