import { Button } from '@rubenchodev/materix-react/components/button';
import { Drawer, useDrawer } from '@rubenchodev/materix-react/components/drawer';
import { List, ListItemButton, ListSubheader } from '@rubenchodev/materix-react/components/list';

export const title = { en: 'Header and footer', es: 'Cabecera y pie' };
export const description = {
  en: 'Without a title the drawer only wraps the content. `title` and `subtitle` generate a text header; `userName`, `userEmail` and `userAvatar`, a user header. `footerInfo` and `footerAction` create a fixed footer; the middle scrolls independently. `closeButton={false}` removes the X.',
  es: 'Sin título el drawer solo envuelve el contenido. `title` y `subtitle` generan una cabecera de texto; `userName`, `userEmail` y `userAvatar`, una cabecera de usuario. `footerInfo` y `footerAction` crean un pie fijo; la zona central se desplaza de forma independiente. `closeButton={false}` quita la X.',
};

export default function Demo() {
  const plain = useDrawer();
  const titled = useDrawer();
  const user = useDrawer();
  const noClose = useDrawer();
  return (
    <div className="demo-row">
      <Button variant="outlined" {...plain.getTriggerProps({ action: 'open' })}>
        Sin cabecera
      </Button>
      <Button variant="outlined" {...titled.getTriggerProps({ action: 'open' })}>
        Con título
      </Button>
      <Button variant="contained" {...user.getTriggerProps({ action: 'open' })}>
        Usuario y pie
      </Button>
      <Button variant="outlined" {...noClose.getTriggerProps({ action: 'open' })}>
        closeButton=&#123;false&#125;
      </Button>

      <Drawer {...plain.drawerProps} aria-label="Navegación">
        <List component="nav" aria-label="Navegación sin cabecera">
          <ListItemButton icon="inbox" selected>
            Bandeja de entrada
          </ListItemButton>
          <ListItemButton icon="star">Destacados</ListItemButton>
          <ListItemButton icon="send">Enviados</ListItemButton>
          <ListItemButton icon="drafts">Borradores</ListItemButton>
        </List>
      </Drawer>

      <Drawer {...titled.drawerProps} title="Proyecto Atlas" subtitle="Sistema de diseño">
        <List component="nav" aria-label="Navegación del proyecto">
          <ListItemButton icon="dashboard" selected>
            Resumen
          </ListItemButton>
          <ListItemButton icon="task_alt">Tareas</ListItemButton>
          <ListItemButton icon="group">Equipo</ListItemButton>
        </List>
      </Drawer>

      <Drawer
        {...user.drawerProps}
        userName="Emma Johnson"
        userEmail="emma@example.com"
        userAvatar="EJ"
        footerInfo="v0.1.0"
        footerAction="Cerrar sesión"
        footerActionIcon="logout"
      >
        <ListSubheader component="div">General</ListSubheader>
        <List component="nav" aria-label="Navegación general">
          <ListItemButton icon="dashboard" selected>
            Panel
          </ListItemButton>
          <ListItemButton icon="mail">Mensajes</ListItemButton>
          <ListItemButton icon="calendar_month">Calendario</ListItemButton>
        </List>
        <ListSubheader component="div">Ajustes</ListSubheader>
        <List component="nav" aria-label="Ajustes">
          <ListItemButton icon="tune">Preferencias</ListItemButton>
          <ListItemButton icon="security">Seguridad</ListItemButton>
          <ListItemButton icon="help_outline">Ayuda</ListItemButton>
        </List>
      </Drawer>

      <Drawer {...noClose.drawerProps} title="Sin botón de cierre" closeButton={false} padded>
        <p>Ciérralo con Escape, el fondo o el botón de abajo.</p>
        <Button variant="contained" data-mtx-drawer-close>
          Cerrar
        </Button>
      </Drawer>
    </div>
  );
}
