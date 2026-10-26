import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Dialog } from '@rubenchodev/materix-react/components/dialog';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: 'The simplest form: `<Dialog open onClose title>` with the content as children. It renders in a portal with the shared `Backdrop`; Escape or a click outside asks to close it and `onClose` updates the state.',
  es: 'La forma más simple: `<Dialog open onClose title>` con el contenido como hijos. Se renderiza en un portal con el `Backdrop` compartido; Escape o un clic fuera solicitan el cierre y `onClose` actualiza el estado.',
};

export default function Demo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="demo-row">
      <Button variant="contained" onClick={() => setOpen(true)}>
        Abrir diálogo
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="¿Usar la ubicación del dispositivo?">
        <p>
          Permite que las aplicaciones determinen tu ubicación para mostrarte resultados cercanos. Pulsa Escape o haz
          clic fuera para cerrar.
        </p>
      </Dialog>
    </div>
  );
}
