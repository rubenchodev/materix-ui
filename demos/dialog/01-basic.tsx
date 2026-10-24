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
        Open dialog
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Use the device location">
        <p>Let apps determine your location to show you nearby results. Press Escape or click outside to close.</p>
      </Dialog>
    </div>
  );
}
