import { Popover, usePopover } from '@rubenchodev/materix-react/components/popover';
import { Button } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: '`usePopover()` replaces `data-open-popover="#id"`: spread `getTriggerProps()` on the trigger and `popoverProps` on the Popover. It opens below the trigger, aligned to the start, on an elevation-8 Paper; focus moves to the first control (or to the panel) and returns to the trigger on close.',
  es: '`usePopover()` sustituye a `data-open-popover="#id"`: extiende `getTriggerProps()` en el disparador y `popoverProps` en el Popover. Se abre debajo del disparador, alineado al inicio, sobre un Paper de elevación 8; el foco pasa al primer control (o al panel) y vuelve al disparador al cerrar.',
};

export default function Demo() {
  const popover = usePopover();
  return (
    <div className="demo-row">
      <Button variant="contained" {...popover.getTriggerProps()}>
        Open popover
      </Button>
      <Popover {...popover.popoverProps} label="Basic popover" className="mtx-p-2">
        The content of the popover.
      </Popover>
    </div>
  );
}
