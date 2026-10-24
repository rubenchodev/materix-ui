import { AppBar } from '@rubenchodev/materix-react/components/app-bar';
import { Drawer } from '@rubenchodev/materix-react/components/drawer';
import { List, ListItemButton } from '@rubenchodev/materix-react/components/list';
import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'Under the AppBar (clipped)', es: 'Bajo la AppBar (clipped)' };
export const description = {
  en: 'The AppBar spans the full width and the drawer starts below it. On a full page use `clipped` on a `permanent`, `responsive` or `persistent` drawer (and on the AppBar); the temporary one is modal and covers the AppBar, as in MUI. Inside a frame, a permanent `absolute` drawer in the row under the AppBar achieves the same.',
  es: 'La AppBar ocupa todo el ancho y el drawer empieza debajo. En una página completa usa `clipped` en un drawer `permanent`, `responsive` o `persistent` (y en la AppBar); el temporal es modal y cubre la AppBar, como en MUI. Dentro de un marco se consigue con un drawer permanente `absolute` en la fila bajo la AppBar.',
};

export default function Demo() {
  return (
    <div className="demo-panel demo-panel--tall mtx-w-100">
      <div className="mtx-d-flex mtx-flex-column" style={{ height: 360 }}>
        <AppBar position="static" color="primary" title="My app" clipped />
        <div className="mtx-position-relative mtx-d-flex mtx-flex-1 mtx-overflow-hidden">
          <Drawer variant="permanent" absolute width={220}>
            <List component="nav" aria-label="App navigation">
              <ListItemButton icon="dashboard" selected>
                Overview
              </ListItemButton>
              <ListItemButton icon="shopping_cart">Orders</ListItemButton>
              <ListItemButton icon="people">Customers</ListItemButton>
              <ListItemButton icon="bar_chart">Reports</ListItemButton>
            </List>
          </Drawer>
          <main className="mtx-flex-1 mtx-min-w-0 mtx-p-2">
            <Typography variant="subtitle1" component="h3" gutterBottom>
              Overview
            </Typography>
            <Typography variant="body2" color="text-secondary">
              The drawer is clipped under the top bar, which stays continuous from edge to edge.
            </Typography>
          </main>
        </div>
      </div>
    </div>
  );
}
