import { List, ListItemButton, ListSubheader } from '@rubenchodev/materix-react/components/list';
import { Paper } from '@rubenchodev/materix-react/components/paper';

export const title = { en: 'Use cases: navigation', es: 'Casos de uso: navegación' };
export const description = {
  en: 'Side navigation with links: the selected row gets `aria-current="page"` (on a button, `aria-current="true"`; `aria-selected` only with `role="option"` or `role="tab"`).',
  es: 'Navegación lateral con enlaces: la fila seleccionada recibe `aria-current="page"` (en un botón, `aria-current="true"`; `aria-selected` solo con `role="option"` o `role="tab"`).',
};

export default function Demo() {
  return (
    <Paper component="nav" variant="outlined" className="demo-fixed-width" aria-label="Sections">
      <List defaultValue="overview">
        <li>
          <ListItemButton href="#use-cases" value="overview" icon="dashboard">
            Overview
          </ListItemButton>
        </li>
        <li>
          <ListItemButton href="#use-cases" value="orders" icon="shopping_bag">
            Orders
          </ListItemButton>
        </li>
        <li>
          <ListItemButton href="#use-cases" value="customers" icon="people">
            Customers
          </ListItemButton>
        </li>
        <ListSubheader>Reports</ListSubheader>
        <li>
          <ListItemButton href="#use-cases" value="sales" icon="bar_chart">
            Sales
          </ListItemButton>
        </li>
      </List>
    </Paper>
  );
}
