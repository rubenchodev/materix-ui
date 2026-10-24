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
      <Dialog open={open === 'paper'} onClose={close} scroll="paper" title="Terms and conditions">
        <DialogContent dividers>
          <p>1. This long text shows the panel&apos;s internal scrolling: the title and the actions stay visible.</p>
          {Array.from({ length: 15 }, (_, index) => (
            <p key={index}>
              {index + 2}. {TERMS[index % TERMS.length]}
            </p>
          ))}
          <p>17. End of document.</p>
        </DialogContent>
        <DialogActions sticky>
          <Button onClick={close}>Decline</Button>
          <Button variant="contained" onClick={close}>
            Accept
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={open === 'body'}
        onClose={close}
        scroll="body"
        title="Release notes"
        actions={
          <Button variant="contained" onClick={close}>
            Got it
          </Button>
        }
      >
        <p>The panel does not limit its height: it grows with the content and the whole dialog scrolls with the wheel or the keyboard.</p>
        {Array.from({ length: 18 }, (_, index) => (
          <p key={index}>
            {index + 1}. Version 1.{index + 1}: performance improvements, accessibility fixes and new theme tokens for the
            feedback components.
          </p>
        ))}
      </Dialog>
    </div>
  );
}
