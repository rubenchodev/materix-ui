import { Popover, usePopover } from '@rubenchodev/materix-react/components/popover';
import { Button } from '@rubenchodev/materix-react/components/button';
import { TextField } from '@rubenchodev/materix-react/components/text-field';

export const title = { en: 'Modal', es: 'Modal' };
export const description = {
  en: 'By default the popover is non-modal: tabbing out of it closes it. With `modal` it traps focus, locks scroll and sets `aria-modal="true"`, like MUI. `data-autofocus` picks the initial focus.',
  es: 'Por defecto el popover no es modal: salir de él con Tab lo cierra. Con `modal` atrapa el foco, bloquea el scroll y añade `aria-modal="true"`, como MUI. `data-autofocus` elige el foco inicial.',
};

export default function Demo() {
  const popover = usePopover();
  return (
    <div className="demo-row">
      <Button variant="outlined" {...popover.getTriggerProps()}>
        Open modal
      </Button>
      <Popover {...popover.popoverProps} modal className="mtx-p-2">
        <h3 className="mtx-typography--subtitle2 mtx-mb-2">Rename</h3>
        <TextField label="Name" size="small" defaultValue="Q3 report" inputProps={{ 'data-autofocus': '' }} />
        <div className="mtx-d-flex mtx-justify-content-end mtx-gap-1 mtx-mt-2">
          <Button variant="text" data-mtx-popover-close="">
            Cancel
          </Button>
          <Button variant="contained" data-mtx-popover-close="">
            Save
          </Button>
        </div>
      </Popover>
    </div>
  );
}
