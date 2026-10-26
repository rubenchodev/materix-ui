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
        No header
      </Button>
      <Button variant="outlined" {...titled.getTriggerProps({ action: 'open' })}>
        With title
      </Button>
      <Button variant="contained" {...user.getTriggerProps({ action: 'open' })}>
        User and footer
      </Button>
      <Button variant="outlined" {...noClose.getTriggerProps({ action: 'open' })}>
        closeButton=&#123;false&#125;
      </Button>

      <Drawer {...plain.drawerProps} aria-label="Navigation">
        <List component="nav" aria-label="Navigation without header">
          <ListItemButton icon="inbox" selected>
            Inbox
          </ListItemButton>
          <ListItemButton icon="star">Starred</ListItemButton>
          <ListItemButton icon="send">Sent</ListItemButton>
          <ListItemButton icon="drafts">Drafts</ListItemButton>
        </List>
      </Drawer>

      <Drawer {...titled.drawerProps} title="Project Atlas" subtitle="Design system">
        <List component="nav" aria-label="Project navigation">
          <ListItemButton icon="dashboard" selected>
            Overview
          </ListItemButton>
          <ListItemButton icon="task_alt">Tasks</ListItemButton>
          <ListItemButton icon="group">Team</ListItemButton>
        </List>
      </Drawer>

      <Drawer
        {...user.drawerProps}
        userName="Emma Johnson"
        userEmail="emma@example.com"
        userAvatar="EJ"
        footerInfo="v0.1.0"
        footerAction="Sign out"
        footerActionIcon="logout"
      >
        <ListSubheader component="div">General</ListSubheader>
        <List component="nav" aria-label="General navigation">
          <ListItemButton icon="dashboard" selected>
            Dashboard
          </ListItemButton>
          <ListItemButton icon="mail">Messages</ListItemButton>
          <ListItemButton icon="calendar_month">Calendar</ListItemButton>
        </List>
        <ListSubheader component="div">Settings</ListSubheader>
        <List component="nav" aria-label="Settings">
          <ListItemButton icon="tune">Preferences</ListItemButton>
          <ListItemButton icon="security">Security</ListItemButton>
          <ListItemButton icon="help_outline">Help</ListItemButton>
        </List>
      </Drawer>

      <Drawer {...noClose.drawerProps} title="No close button" closeButton={false} padded>
        <p>Close it with Escape, the backdrop or the button below.</p>
        <Button variant="contained" data-mtx-drawer-close>
          Close
        </Button>
      </Drawer>
    </div>
  );
}
