import { List, ListItem, ListSubheader } from '@rubenchodev/materix-react/components/list';
import { Paper } from '@rubenchodev/materix-react/components/paper';

export const title = { en: 'Subheaders', es: 'Subcabeceras' };
export const description = {
  en: '`ListSubheader` titles groups. `inset` aligns the title with the text; `sticky` pins it while the list scrolls.',
  es: '`ListSubheader` titula grupos. `inset` alinea el título con el texto; `sticky` lo fija mientras la lista se desplaza.',
};

const contacts = [
  { letter: 'A', names: ['Anna Garcia', 'Andrew Lopez', 'Ariana Stone'] },
  { letter: 'C', names: ['Charles Reed', 'Carmen Vidal'] },
  { letter: 'L', names: ['Lucy Mendez', 'Luis Perez'] },
];

/** Alto del contenedor desplazable que demuestra las subcabeceras fijas. */
const scrollArea = { maxHeight: 240, overflow: 'auto' } as const;

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">Inset</span>
        <Paper variant="outlined">
          <List aria-label="Settings by category">
            <ListSubheader inset>General</ListSubheader>
            <ListItem icon="account_circle">Account</ListItem>
            <ListItem icon="security">Privacy</ListItem>
            <ListSubheader inset>Communications</ListSubheader>
            <ListItem icon="notifications">Notifications</ListItem>
          </List>
        </Paper>
      </div>
      <div className="demo-group">
        <span className="demo-label">Sticky (scroll the list)</span>
        <Paper variant="outlined">
          <List aria-label="Contacts by letter" tabIndex={0} style={scrollArea}>
            {contacts.map((group) => [
              <ListSubheader key={group.letter} sticky>
                {group.letter}
              </ListSubheader>,
              ...group.names.map((name) => <ListItem key={name}>{name}</ListItem>),
            ])}
          </List>
        </Paper>
      </div>
    </div>
  );
}
