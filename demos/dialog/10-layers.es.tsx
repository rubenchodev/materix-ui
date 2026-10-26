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
  const [permission, setPermission] = useState('Puede ver');
  const popover = usePopover();
  const menu = useMenu();
  const close = () => setOpen(false);
  return (
    <div className="demo-row">
      <Button variant="contained" onClick={() => setOpen(true)}>
        Abrir diálogo
      </Button>
      <Dialog
        open={open}
        onClose={close}
        maxWidth="sm"
        title="Compartir informe"
        actions={<Button onClick={close}>Cerrar</Button>}
      >
        <div className="mtx-d-flex mtx-gap-1 mtx-flex-wrap">
          <Button variant="outlined" startIcon="tune" {...popover.getTriggerProps()}>
            Opciones
          </Button>
          <Button variant="outlined" endIcon="arrow_drop_down" {...menu.triggerProps}>
            {permission}
          </Button>
        </div>
        <Popover {...popover.popoverProps} label="Opciones" className="mtx-p-2">
          <div className="mtx-d-flex mtx-align-items-center mtx-gap-1">
            <Checkbox label="Notificar a las personas" defaultChecked />
            <Tooltip title="Las personas reciben un correo con el enlace">
              <IconButton icon="info" aria-label="Acerca de las notificaciones" />
            </Tooltip>
          </div>
        </Popover>
        <Menu {...menu.menuProps}>
          <MenuGroup label="Permiso" value={permission} onChange={setPermission}>
            <MenuItem role="menuitemradio" value="Puede ver">
              Puede ver
            </MenuItem>
            <MenuItem role="menuitemradio" value="Puede comentar">
              Puede comentar
            </MenuItem>
            <MenuItem role="menuitemradio" value="Puede editar">
              Puede editar
            </MenuItem>
          </MenuGroup>
        </Menu>
      </Dialog>
    </div>
  );
}
