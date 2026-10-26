import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Dialog, DialogActions, DialogContent } from '@rubenchodev/materix-react/components/dialog';

export const title = { en: 'Scroll: paper and body', es: 'Scroll: panel y página' };
export const description = {
  en: 'With `scroll="paper"` (default) the content scrolls inside the panel; `DialogContent dividers` separates the areas and `DialogActions sticky` pins the actions. With `scroll="body"` the panel grows and the dialog container scrolls.',
  es: 'Con `scroll="paper"` (por defecto) el contenido hace scroll dentro del panel; `DialogContent dividers` separa las zonas y `DialogActions sticky` fija las acciones. Con `scroll="body"` el panel crece y hace scroll el contenedor del diálogo.',
};

const TERMS = [
  'Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam.',
  'Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl.',
  'Aenean lacinia bibendum nulla sed consectetur. Duis mollis, est non commodo luctus, nisi erat porttitor ligula.',
];

export default function Demo() {
  const [open, setOpen] = useState<'paper' | 'body' | null>(null);
  const close = () => setOpen(null);
  return (
    <div className="demo-row">
      <Button variant="contained" onClick={() => setOpen('paper')}>
        scroll = paper
      </Button>
      <Button variant="outlined" onClick={() => setOpen('body')}>
        scroll = body
      </Button>
      <Dialog open={open === 'paper'} onClose={close} scroll="paper" title="Términos y condiciones">
        <DialogContent dividers>
          <p>1. Este texto largo muestra el scroll interno del panel: el título y las acciones siguen visibles.</p>
          {Array.from({ length: 15 }, (_, index) => (
            <p key={index}>
              {index + 2}. {TERMS[index % TERMS.length]}
            </p>
          ))}
          <p>17. Fin del documento.</p>
        </DialogContent>
        <DialogActions sticky>
          <Button onClick={close}>Rechazar</Button>
          <Button variant="contained" onClick={close}>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={open === 'body'}
        onClose={close}
        scroll="body"
        title="Notas de la versión"
        actions={
          <Button variant="contained" onClick={close}>
            Entendido
          </Button>
        }
      >
        <p>El panel no limita su altura: crece con el contenido y todo el diálogo se desplaza con la rueda o el teclado.</p>
        {Array.from({ length: 18 }, (_, index) => (
          <p key={index}>
            {index + 1}. Versión 1.{index + 1}: mejoras de rendimiento, correcciones de accesibilidad y nuevos tokens de
            tema para los componentes de feedback.
          </p>
        ))}
      </Dialog>
    </div>
  );
}
