import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Dialog } from '@rubenchodev/materix-react/components/dialog';
import type { DialogMaxWidth } from '@rubenchodev/materix-react/components/dialog';

export const title = { en: 'Sizes', es: 'Tamaños' };
export const description = {
  en: '`maxWidth` sets the maximum width: `xs` (20rem, the lowest step), `sm` (24rem), `md` (32rem, default), `lg` (48rem), `xl` (64rem) or `false`. `fullWidth={false}` fits the content and `fullScreen` takes the whole window without rounded corners.',
  es: '`maxWidth` fija el ancho máximo: `xs` (20rem, el escalón inferior), `sm` (24rem), `md` (32rem, por defecto), `lg` (48rem), `xl` (64rem) o `false`. `fullWidth={false}` se ajusta al contenido y `fullScreen` ocupa toda la ventana sin esquinas redondeadas.',
};

interface SizeOption {
  key: string;
  maxWidth: DialogMaxWidth;
  label: string;
  title: string;
  text: string;
}

const SIZES: SizeOption[] = [
  { key: 'xs', maxWidth: 'xs', label: 'XS · 20rem', title: 'Tamaño XS', text: 'Ancho máximo de 20rem, el escalón inferior de la escala.' },
  { key: 'sm', maxWidth: 'sm', label: 'SM · 24rem', title: 'Tamaño SM', text: 'Ancho máximo de 24rem, ideal para confirmaciones breves.' },
  { key: 'md', maxWidth: 'md', label: 'MD · 32rem', title: 'Tamaño MD', text: 'Ancho máximo de 32rem; es el valor por defecto.' },
  { key: 'lg', maxWidth: 'lg', label: 'LG · 48rem', title: 'Tamaño LG', text: 'Ancho máximo de 48rem, útil para formularios a dos columnas.' },
  { key: 'xl', maxWidth: 'xl', label: 'XL · 64rem', title: 'Tamaño XL', text: 'Ancho máximo de 64rem, para tablas o vistas previas.' },
  {
    key: 'none',
    maxWidth: false,
    label: 'Sin ancho máximo',
    title: 'Sin ancho máximo',
    text: 'Con maxWidth={false} el panel usa toda la ventana menos los márgenes.',
  },
];

export default function Demo() {
  const [open, setOpen] = useState<string | null>(null);
  const close = () => setOpen(null);
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">Ancho máximo</span>
        <div className="demo-row">
          {SIZES.map((size) => (
            <Button key={size.key} variant="outlined" onClick={() => setOpen(size.key)}>
              {size.label}
            </Button>
          ))}
          <Button variant="outlined" onClick={() => setOpen('fit')}>
            Ajustar al contenido
          </Button>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Pantalla completa</span>
        <div className="demo-row">
          <Button variant="contained" onClick={() => setOpen('full')}>
            Abrir a pantalla completa
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
          actions={<Button onClick={close}>Cerrar</Button>}
        >
          {size.text}
        </Dialog>
      ))}
      <Dialog
        open={open === 'fit'}
        onClose={close}
        fullWidth={false}
        title="Se ajusta a su contenido"
        actions={<Button onClick={close}>Cerrar</Button>}
      >
        Con fullWidth={'{false}'} el panel es tan ancho como su contenido.
      </Dialog>
      <Dialog
        open={open === 'full'}
        onClose={close}
        fullScreen
        title="Editar publicación"
        actions={
          <>
            <Button onClick={close}>Descartar</Button>
            <Button variant="contained" onClick={close}>
              Guardar
            </Button>
          </>
        }
      >
        <p>
          El panel ocupa toda la ventana y pierde las esquinas redondeadas, como el diálogo <code>fullScreen</code> de
          MUI. Es el patrón recomendado en móviles para tareas largas.
        </p>
      </Dialog>
    </div>
  );
}
