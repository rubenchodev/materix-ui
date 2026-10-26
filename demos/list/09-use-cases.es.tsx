import { Divider } from '@rubenchodev/materix-react/components/divider';
import { List, ListItemButton, ListSelectionProvider, ListSubheader } from '@rubenchodev/materix-react/components/list';
import { Paper } from '@rubenchodev/materix-react/components/paper';

export const title = { en: 'Use cases: navigation', es: 'Casos de uso: navegación' };
export const description = {
  en: 'Side navigation with links in two sections separated by a `Divider`. `ListSelectionProvider` shares one selection across both lists (in vanilla the scope is the containing `nav`): the selected row gets `aria-current="page"`.',
  es: 'Navegación lateral con enlaces en dos secciones separadas por un `Divider`. `ListSelectionProvider` comparte una sola selección entre ambas listas (en vanilla el ámbito es el `nav` contenedor): la fila seleccionada recibe `aria-current="page"`.',
};

export default function Demo() {
  return (
    <ListSelectionProvider defaultValue="overview">
      <Paper component="nav" variant="outlined" className="demo-fixed-width" aria-label="Secciones">
        <List aria-label="Tienda">
          <li>
            <ListItemButton href="#use-cases" value="overview" icon="dashboard">
              Resumen
            </ListItemButton>
          </li>
          <li>
            <ListItemButton href="#use-cases" value="orders" icon="shopping_bag">
              Pedidos
            </ListItemButton>
          </li>
          <li>
            <ListItemButton href="#use-cases" value="customers" icon="people">
              Clientes
            </ListItemButton>
          </li>
        </List>
        <Divider />
        <List aria-label="Informes" subheader={<ListSubheader>Informes</ListSubheader>}>
          <li>
            <ListItemButton href="#use-cases" value="sales" icon="bar_chart">
              Ventas
            </ListItemButton>
          </li>
          <li>
            <ListItemButton href="#use-cases" value="traffic" icon="insights">
              Tráfico
            </ListItemButton>
          </li>
        </List>
      </Paper>
    </ListSelectionProvider>
  );
}
