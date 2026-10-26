import { Popover, usePopover } from '@rubenchodev/materix-react/components/popover';
import type { PopoverOrigin } from '@rubenchodev/materix-react/components/popover';
import { Button } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'Anchor origins', es: 'Orígenes de anclaje' };
export const description = {
  en: 'The MUI API: `anchorOrigin` (the point on the anchor) and `transformOrigin` (the point on the popover attached to it), with `top|center|bottom` and `left|center|right` or pixels. The popover stays 16 px away from the viewport edges.',
  es: 'La API de MUI: `anchorOrigin` (el punto del ancla) y `transformOrigin` (el punto del popover unido a él), con `top|center|bottom` y `left|center|right` o píxeles. El popover se mantiene a 16 px de los bordes del viewport.',
};

const CASES: Array<{ anchor: PopoverOrigin; transform: PopoverOrigin }> = [
  { anchor: { vertical: 'bottom', horizontal: 'left' }, transform: { vertical: 'top', horizontal: 'left' } },
  { anchor: { vertical: 'center', horizontal: 'center' }, transform: { vertical: 'center', horizontal: 'center' } },
  { anchor: { vertical: 'top', horizontal: 'right' }, transform: { vertical: 'bottom', horizontal: 'right' } },
];

const describe = (origin: PopoverOrigin) => `${origin.vertical} ${origin.horizontal}`;

/** Disparador con orígenes MUI. */
function Origin({ anchor, transform, index }: { anchor: PopoverOrigin; transform: PopoverOrigin; index: number }) {
  const popover = usePopover();
  return (
    <>
      <Button variant="outlined" {...popover.getTriggerProps()}>
        {describe(anchor)} → {describe(transform)}
      </Button>
      <Popover
        {...popover.popoverProps}
        anchorOrigin={anchor}
        transformOrigin={transform}
        label={`Origen ${index + 1}`}
        className="mtx-p-2"
      >
        anchor: {describe(anchor)} · transform: {describe(transform)}
      </Popover>
    </>
  );
}

export default function Demo() {
  return (
    <div className="demo-row">
      {CASES.map((item, index) => (
        <Origin key={index} index={index} anchor={item.anchor} transform={item.transform} />
      ))}
    </div>
  );
}
