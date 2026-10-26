import { Popover, usePopover } from '@rubenchodev/materix-react/components/popover';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Checkbox } from '@rubenchodev/materix-react/components/checkbox';

export const title = { en: 'Layer from a popover', es: 'Capa desde un popover' };
export const description = {
  en: 'A popover can open another popover. They share the layer stack: clicks in the upper layer are not "outside", and each Escape closes only the top layer.',
  es: 'Un popover puede abrir otro popover. Comparten la pila de capas: los clics en la capa superior no cuentan como "fuera" y cada Escape cierra solo la capa superior.',
};

export default function Demo() {
  const outer = usePopover();
  const inner = usePopover();
  return (
    <div className="demo-row">
      <Button variant="outlined" startIcon="tune" {...outer.getTriggerProps()}>
        Opciones
      </Button>
      <Popover {...outer.popoverProps} label="Opciones" className="mtx-p-2">
        <Checkbox label="Solo los míos" defaultChecked />
        <div className="mtx-d-flex mtx-justify-content-end mtx-mt-1">
          <Button variant="text" {...inner.getTriggerProps()}>
            Avanzado…
          </Button>
        </div>
        <Popover
          {...inner.popoverProps}
          placement="right-start"
          offset={8}
          label="Opciones avanzadas"
          className="mtx-p-2 demo-fixed-width"
        >
          <p className="mtx-typography--body2 mtx-mb-1">
            Pulsa Escape una vez para cerrar esta capa; el primer popover sigue abierto.
          </p>
          <Checkbox label="Incluir archivados" />
        </Popover>
      </Popover>
    </div>
  );
}
