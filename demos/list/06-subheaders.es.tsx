import { List, ListItem, ListSubheader } from '@rubenchodev/materix-react/components/list';
import { Paper } from '@rubenchodev/materix-react/components/paper';

export const title = { en: 'Subheaders', es: 'Subcabeceras' };
export const description = {
  en: '`ListSubheader` titles groups. `inset` aligns the title with the text; `sticky` pins it while the list scrolls.',
  es: '`ListSubheader` titula grupos. `inset` alinea el título con el texto; `sticky` lo fija mientras la lista se desplaza.',
};

const contacts = [
  { letter: 'A', names: ['Ana García', 'Andrés López', 'Ariadna Torres'] },
  { letter: 'C', names: ['Carlos Ruiz', 'Carmen Vidal'] },
  { letter: 'L', names: ['Lucía Méndez', 'Luis Pérez'] },
];

/** Alto del contenedor desplazable que demuestra las subcabeceras fijas. */
const scrollArea = { maxHeight: 240, overflow: 'auto' } as const;

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">Con sangría (inset)</span>
        <Paper variant="outlined">
          <List aria-label="Ajustes por categoría">
            <ListSubheader inset>General</ListSubheader>
            <ListItem icon="account_circle">Cuenta</ListItem>
            <ListItem icon="security">Privacidad</ListItem>
            <ListSubheader inset>Comunicaciones</ListSubheader>
            <ListItem icon="notifications">Notificaciones</ListItem>
          </List>
        </Paper>
      </div>
      <div className="demo-group">
        <span className="demo-label">Fija (desplaza la lista)</span>
        <Paper variant="outlined">
          <List aria-label="Contactos por letra" tabIndex={0} style={scrollArea}>
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
