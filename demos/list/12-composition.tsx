import { Avatar } from '@rubenchodev/materix-react/components/avatar';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
} from '@rubenchodev/materix-react/components/list';
import { Paper } from '@rubenchodev/materix-react/components/paper';

export const title = { en: 'Composition with subcomponents', es: 'Composición con subcomponentes' };
export const description = {
  en: 'For fine-grained control (the equivalent of the vanilla BEM syntax), compose `ListItemIcon`, `ListItemAvatar`, `ListItemText` and `ListItemSecondaryAction` inside the rows.',
  es: 'Para un control fino (el equivalente a la sintaxis BEM de vanilla), compón `ListItemIcon`, `ListItemAvatar`, `ListItemText` y `ListItemSecondaryAction` dentro de las filas.',
};

export default function Demo() {
  return (
    <Paper variant="outlined" className="demo-fixed-width">
      <List aria-label="Composition" subheader={<ListSubheader>Mail</ListSubheader>}>
        <ListItem>
          <ListItemIcon icon="inbox" />
          <ListItemText primary="Inbox" secondary="Composed with subcomponents" />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>AG</Avatar>
          </ListItemAvatar>
          <ListItemText primary="Anna Garcia" />
          <ListItemSecondaryAction>
            <IconButton icon="mail" aria-label="Email Anna Garcia" />
          </ListItemSecondaryAction>
        </ListItem>
        <li>
          <ListItemButton selected>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </li>
      </List>
    </Paper>
  );
}
