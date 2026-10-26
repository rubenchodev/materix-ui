import { Popover, usePopover } from '@rubenchodev/materix-react/components/popover';
import type { PopoverProps } from '@rubenchodev/materix-react/components/popover';
import { Button } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'Placement', es: 'Colocación' };
export const description = {
  en: '`placement` uses the same engine as Tooltip (`top|bottom|left|right` with `-start|-end`; `bottom-start` by default), with automatic flip and shift. `offset` sets the gap in px (0 by default).',
  es: '`placement` usa el mismo motor que Tooltip (`top|bottom|left|right` con `-start|-end`; `bottom-start` por defecto), con volteo y desplazamiento automáticos. `offset` fija la separación en px (0 por defecto).',
};

/** Disparador con su propio popover colocado. */
function Placed({ label, text, ...props }: { label: string; text: string } & Partial<PopoverProps>) {
  const popover = usePopover();
  return (
    <>
      <Button variant="outlined" {...popover.getTriggerProps()}>
        {label}
      </Button>
      <Popover {...popover.popoverProps} label={label} className="mtx-p-2" {...props}>
        {text}
      </Popover>
    </>
  );
}

export default function Demo() {
  return (
    <div className="demo-row">
      <Placed label="top" text="Arriba y centrado." placement="top" offset={8} />
      <Placed label="bottom-end" text="Abajo, alineado al final." placement="bottom-end" />
      <Placed label="right · offset 8" text="A la derecha." placement="right" offset={8} />
      <Placed label="left · offset 8" text="A la izquierda." placement="left" offset={8} />
    </div>
  );
}
