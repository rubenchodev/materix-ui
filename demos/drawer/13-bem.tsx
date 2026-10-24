import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader } from '@rubenchodev/materix-react/components/drawer';
import { TextField } from '@rubenchodev/materix-react/components/text-field';

export const title = { en: 'Manual BEM composition', es: 'Composición BEM manual' };
export const description = {
  en: 'With `DrawerHeader`, `DrawerContent` and `DrawerFooter` as children the drawer generates nothing and only adds behavior: header and footer stay outside the scrollable panel, which receives the dialog semantics. `aria-labelledby` on the drawer names the panel.',
  es: 'Con `DrawerHeader`, `DrawerContent` y `DrawerFooter` como hijos el drawer no genera nada y solo añade comportamiento: cabecera y pie quedan fuera del panel desplazable, que recibe la semántica de diálogo. `aria-labelledby` en el drawer nombra el panel.',
};

export default function Demo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Open BEM drawer
      </Button>
      <Drawer width="wide" open={open} onClose={() => setOpen(false)} aria-labelledby="drawer-bem-title">
        <DrawerHeader>
          <h3 className="mtx-drawer__title" id="drawer-bem-title">
            Edit profile
          </h3>
          <button type="button" className="mtx-icon-button mtx-drawer__close" aria-label="Close" data-mtx-drawer-close>
            <span className="material-icons" aria-hidden="true">
              close
            </span>
          </button>
        </DrawerHeader>
        <DrawerContent padded>
          <TextField label="Name" defaultValue="Emma Johnson" fullWidth />
        </DrawerContent>
        <DrawerFooter>
          <Button data-mtx-drawer-close>Cancel</Button>
          <Button variant="contained" data-mtx-drawer-close>
            Save
          </Button>
        </DrawerFooter>
      </Drawer>
    </>
  );
}
