import { Button } from '@rubenchodev/materix-react/components/button';
import { Drawer, useDrawer } from '@rubenchodev/materix-react/components/drawer';
import { List, ListItemButton } from '@rubenchodev/materix-react/components/list';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: '`<Drawer open onClose title>` with its content directly inside: `title` generates the header and the close button, the content goes into the scrollable panel and the temporary drawer adds the backdrop. Close it with Escape, the backdrop or the X.',
  es: '`<Drawer open onClose title>` con el contenido directamente dentro: `title` genera la cabecera y el botón de cierre, el contenido va al panel desplazable y el drawer temporal añade el fondo. Ciérralo con Escape, el fondo o la X.',
};

export default function Demo() {
  const drawer = useDrawer();
  return (
    <>
      <div className="demo-row">
        <Button variant="contained" {...drawer.getTriggerProps({ action: 'open' })}>
          Abrir navegación
        </Button>
      </div>
      <Drawer {...drawer.drawerProps} title="Correo">
        <List component="nav" aria-label="Navegación principal">
          <ListItemButton icon="inbox" href="#inbox" selected>
            Bandeja de entrada
          </ListItemButton>
          <ListItemButton icon="star" href="#starred">
            Destacados
          </ListItemButton>
          <ListItemButton icon="send" href="#sent">
            Enviados
          </ListItemButton>
          <ListItemButton icon="drafts" href="#drafts">
            Borradores
          </ListItemButton>
        </List>
      </Drawer>
    </>
  );
}
