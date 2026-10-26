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
        <AppBar position="static" color="primary" title="Mi aplicación" clipped />
        <div className="mtx-position-relative mtx-d-flex mtx-flex-1 mtx-overflow-hidden">
          <Drawer variant="permanent" absolute width={220}>
            <List component="nav" aria-label="Navegación de la aplicación">
              <ListItemButton icon="dashboard" selected>
                Resumen
              </ListItemButton>
              <ListItemButton icon="shopping_cart">Pedidos</ListItemButton>
              <ListItemButton icon="people">Clientes</ListItemButton>
              <ListItemButton icon="bar_chart">Informes</ListItemButton>
            </List>
          </Drawer>
          <main className="mtx-flex-1 mtx-min-w-0 mtx-p-2">
            <Typography variant="subtitle1" component="h3" gutterBottom>
              Resumen
            </Typography>
            <Typography variant="body2" color="text-secondary">
              El drawer queda recortado bajo la barra superior, que se mantiene continua de borde a borde.
            </Typography>
          </main>
        </div>
      </div>
    </div>
  );
}
