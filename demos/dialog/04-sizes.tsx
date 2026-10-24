import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Dialog } from '@rubenchodev/materix-react/components/dialog';
import type { DialogMaxWidth } from '@rubenchodev/materix-react/components/dialog';

export const title = { en: 'Sizes', es: 'Tamaños' };
export const description = {
  en: '`maxWidth` sets the maximum width: `xs` (20rem), `sm` (24rem), `md` (32rem, default), `lg` (48rem), `xl` (64rem) or `false`. `fullWidth={false}` fits the content and `fullScreen` takes the whole window without rounded corners.',
  es: '`maxWidth` fija el ancho máximo: `xs` (20rem), `sm` (24rem), `md` (32rem, por defecto), `lg` (48rem), `xl` (64rem) o `false`. `fullWidth={false}` se ajusta al contenido y `fullScreen` ocupa toda la ventana sin esquinas redondeadas.',
};

interface SizeOption {
  key: string;
  maxWidth: DialogMaxWidth;
  label: string;
  title: string;
  text: string;
}

const SIZES: SizeOption[] = [
  { key: 'xs', maxWidth: 'xs', label: 'XS · 20rem', title: 'XS size', text: 'Max width of 20rem, for very short messages.' },
  { key: 'sm', maxWidth: 'sm', label: 'SM · 24rem', title: 'SM size', text: 'Max width of 24rem, ideal for short confirmations.' },
  { key: 'md', maxWidth: 'md', label: 'MD · 32rem', title: 'MD size', text: 'Max width of 32rem; this is the default value.' },
  { key: 'lg', maxWidth: 'lg', label: 'LG · 48rem', title: 'LG size', text: 'Max width of 48rem, useful for two-column forms.' },
  { key: 'xl', maxWidth: 'xl', label: 'XL · 64rem', title: 'XL size', text: 'Max width of 64rem, for tables or previews.' },
  {
    key: 'none',
    maxWidth: false,
    label: 'No max width',
    title: 'No max width',
    text: 'With maxWidth={false} the panel uses the whole window minus the margins.',
  },
];

export default function Demo() {
  const [open, setOpen] = useState<string | null>(null);
  const close = () => setOpen(null);
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">Max width</span>
        <div className="demo-row">
          {SIZES.map((size) => (
            <Button key={size.key} variant="outlined" onClick={() => setOpen(size.key)}>
              {size.label}
            </Button>
          ))}
          <Button variant="outlined" onClick={() => setOpen('fit')}>
            Fit content
          </Button>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Full screen</span>
        <div className="demo-row">
          <Button variant="contained" onClick={() => setOpen('full')}>
            Open full screen
          </Button>
        </div>
      </div>
      {SIZES.map((size) => (
        <Dialog
          key={size.key}
          open={open === size.key}
          onClose={close}
          maxWidth={size.maxWidth}
          title={size.title}
          actions={<Button onClick={close}>Close</Button>}
        >
          {size.text}
        </Dialog>
      ))}
      <Dialog
        open={open === 'fit'}
        onClose={close}
        fullWidth={false}
        title="Fits its content"
        actions={<Button onClick={close}>Close</Button>}
      >
        With fullWidth={'{false}'} the panel is as wide as its content.
      </Dialog>
      <Dialog
        open={open === 'full'}
        onClose={close}
        fullScreen
        title="Edit post"
        actions={
          <>
            <Button onClick={close}>Discard</Button>
            <Button variant="contained" onClick={close}>
              Save
            </Button>
          </>
        }
      >
        <p>
          The panel takes the whole window and loses its rounded corners, like the MUI <code>fullScreen</code> dialog. It
          is the recommended pattern on mobile for long tasks.
        </p>
      </Dialog>
    </div>
  );
}
