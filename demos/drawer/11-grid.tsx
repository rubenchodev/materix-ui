import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Checkbox } from '@rubenchodev/materix-react/components/checkbox';
import { Drawer } from '@rubenchodev/materix-react/components/drawer';
import { Grid } from '@rubenchodev/materix-react/components/grid';
import { TextField } from '@rubenchodev/materix-react/components/text-field';

export const title = { en: 'With a grid: filter panel', es: 'Con grilla: panel de filtros' };
export const description = {
  en: 'A right drawer with `width="wide"` and `padded` containing a form laid out with `Grid`. `data-drawer-autofocus` on the search field (through `inputProps`) receives the initial focus; buttons with `data-mtx-drawer-close` close it.',
  es: 'Un drawer derecho con `width="wide"` y `padded` que contiene un formulario maquetado con `Grid`. `data-drawer-autofocus` en el campo de búsqueda (vía `inputProps`) recibe el foco inicial; los botones con `data-mtx-drawer-close` lo cierran.',
};

export default function Demo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="demo-row">
        <Button variant="outlined" startIcon="filter_list" onClick={() => setOpen(true)}>
          Filters
        </Button>
      </div>
      <Drawer anchor="right" width="wide" padded title="Filters" open={open} onClose={() => setOpen(false)}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <TextField
              label="Search"
              type="search"
              startIcon="search"
              fullWidth
              inputProps={{ 'data-drawer-autofocus': '' }}
            />
          </Grid>
          <Grid size={6}>
            <TextField label="Min. price" type="number" fullWidth />
          </Grid>
          <Grid size={6}>
            <TextField label="Max. price" type="number" fullWidth />
          </Grid>
          <Grid size={12}>
            <Checkbox label="In stock only" defaultChecked />
          </Grid>
          <Grid size={6}>
            <Button variant="outlined" fullWidth data-mtx-drawer-close>
              Clear
            </Button>
          </Grid>
          <Grid size={6}>
            <Button variant="contained" fullWidth data-mtx-drawer-close>
              Apply
            </Button>
          </Grid>
        </Grid>
      </Drawer>
    </>
  );
}
