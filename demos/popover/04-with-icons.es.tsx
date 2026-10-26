import { Popover, usePopover } from '@rubenchodev/materix-react/components/popover';
import { Button } from '@rubenchodev/materix-react/components/button';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';

export const title = { en: 'With icons', es: 'Con iconos' };
export const description = {
  en: 'Any button can be a trigger; icon-only ones need an `aria-label`. Each trigger gets `aria-haspopup="dialog"`, `aria-controls` and `aria-expanded`; with several triggers, a `key` marks the active one.',
  es: 'Cualquier botón puede ser disparador; los de solo icono necesitan un `aria-label`. Cada disparador recibe `aria-haspopup="dialog"`, `aria-controls` y `aria-expanded`; con varios disparadores, una `key` marca el activo.',
};

export default function Demo() {
  const popover = usePopover();
  return (
    <div className="demo-row">
      <IconButton icon="info" aria-label="Información del pedido" {...popover.getTriggerProps({ key: 'icon' })} />
      <Button variant="outlined" startIcon="tune" {...popover.getTriggerProps({ key: 'details' })}>
        Detalles
      </Button>
      <Button variant="text" endIcon="expand_more" {...popover.getTriggerProps({ key: 'more' })}>
        Más
      </Button>
      <Popover {...popover.popoverProps} className="mtx-p-2 demo-fixed-width">
        <h3 className="mtx-typography--subtitle2 mtx-mb-1">Pedido #48213</h3>
        <p className="mtx-typography--body2 mtx-color-text-secondary">
          Enviado el 12 de octubre con entrega estimada en 48 h.
        </p>
      </Popover>
    </div>
  );
}
