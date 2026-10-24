import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Checkbox } from '@rubenchodev/materix-react/components/checkbox';
import { Dialog } from '@rubenchodev/materix-react/components/dialog';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';
import { Menu, MenuGroup, MenuItem, useMenu } from '@rubenchodev/materix-react/components/menu';
import { Popover, usePopover } from '@rubenchodev/materix-react/components/popover';
import { Tooltip } from '@rubenchodev/materix-react/components/tooltip';

export const title = { en: 'Stacked layers and Escape', es: 'Capas apiladas y Escape' };
export const description = {
  en: 'A `Popover`, a `Menu` and a `Tooltip` opened inside a dialog join the shared layer stack: each `Escape` closes only the top layer (a visible tooltip first), and interacting with them never closes the dialog.',
  es: 'Un `Popover`, un `Menu` y un `Tooltip` abiertos dentro de un diálogo se suman a la pila común de capas: cada `Escape` cierra solo la capa superior (primero un tooltip visible) e interactuar con ellos nunca cierra el diálogo.',
};

export default function Demo() {
  const [open, setOpen] = useState(false);
  const [permission, setPermission] = useState('Can view');
  const popover = usePopover();
  const menu = useMenu();
  const close = () => setOpen(false);
  return (
    <div className="demo-row">
      <Button variant="contained" onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      <Dialog
        open={open}
        onClose={close}
        maxWidth="sm"
        title="Share report"
        actions={<Button onClick={close}>Close</Button>}
      >
        <div className="mtx-d-flex mtx-gap-1 mtx-flex-wrap">
          <Button variant="outlined" startIcon="tune" {...popover.getTriggerProps()}>
            Options
          </Button>
          <Button variant="outlined" endIcon="arrow_drop_down" {...menu.triggerProps}>
            {permission}
          </Button>
        </div>
        <Popover {...popover.popoverProps} label="Options" className="mtx-p-2">
          <div className="mtx-d-flex mtx-align-items-center mtx-gap-1">
            <Checkbox label="Notify people" defaultChecked />
            <Tooltip title="People get an email with the link">
              <IconButton icon="info" aria-label="About notifications" />
            </Tooltip>
          </div>
        </Popover>
        <Menu {...menu.menuProps}>
          <MenuGroup label="Permission" value={permission} onChange={setPermission}>
            <MenuItem role="menuitemradio" value="Can view">
              Can view
            </MenuItem>
            <MenuItem role="menuitemradio" value="Can comment">
              Can comment
            </MenuItem>
            <MenuItem role="menuitemradio" value="Can edit">
              Can edit
            </MenuItem>
          </MenuGroup>
        </Menu>
      </Dialog>
    </div>
  );
}
