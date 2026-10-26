import { Button } from '@rubenchodev/materix-react/components/button';
import { Checkbox } from '@rubenchodev/materix-react/components/checkbox';
import { Drawer, useDrawer } from '@rubenchodev/materix-react/components/drawer';
import { Grid } from '@rubenchodev/materix-react/components/grid';
import { TextField } from '@rubenchodev/materix-react/components/text-field';

export const title = { en: 'With a grid: filter panel', es: 'Con grilla: panel de filtros' };
export const description = {
  en: 'A right drawer with `width="wide"` and `padded` containing a form laid out with `Grid`. `data-drawer-autofocus` on the search field (through `inputProps`) receives the initial focus; buttons with `data-mtx-drawer-close` close it.',
  es: 'Un drawer derecho con `width="wide"` y `padded` que contiene un formulario maquetado con `Grid`. `data-drawer-autofocus` en el campo de búsqueda (vía `inputProps`) recibe el foco inicial; los botones con `data-mtx-drawer-close` lo cierran.',
};

export default function Demo() {
  const drawer = useDrawer();
  return (
    <>
      <div className="demo-row">
        <Button variant="outlined" startIcon="filter_list" {...drawer.getTriggerProps({ action: 'open' })}>
          Filtros
        </Button>
      </div>
      <Drawer anchor="right" width="wide" padded title="Filtros" {...drawer.drawerProps}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <TextField
              label="Buscar"
              type="search"
              startIcon="search"
              fullWidth
              inputProps={{ 'data-drawer-autofocus': '' }}
            />
          </Grid>
          <Grid size={6}>
            <TextField label="Precio mín." type="number" fullWidth />
          </Grid>
          <Grid size={6}>
            <TextField label="Precio máx." type="number" fullWidth />
          </Grid>
          <Grid size={12}>
            <Checkbox label="Solo en stock" defaultChecked />
          </Grid>
          <Grid size={6}>
            <Button variant="outlined" fullWidth data-mtx-drawer-close>
              Limpiar
            </Button>
          </Grid>
          <Grid size={6}>
            <Button variant="contained" fullWidth data-mtx-drawer-close>
              Aplicar
            </Button>
          </Grid>
        </Grid>
      </Drawer>
    </>
  );
}
