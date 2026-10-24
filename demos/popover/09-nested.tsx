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
        Options
      </Button>
      <Popover {...outer.popoverProps} label="Options" className="mtx-p-2">
        <Checkbox label="Only mine" defaultChecked />
        <div className="mtx-d-flex mtx-justify-content-end mtx-mt-1">
          <Button variant="text" {...inner.getTriggerProps()}>
            Advanced…
          </Button>
        </div>
        <Popover
          {...inner.popoverProps}
          placement="right-start"
          offset={8}
          label="Advanced options"
          className="mtx-p-2 demo-fixed-width"
        >
          <p className="mtx-typography--body2 mtx-mb-1">
            Press Escape once to close this layer; the first popover stays open.
          </p>
          <Checkbox label="Include archived" />
        </Popover>
      </Popover>
    </div>
  );
}
