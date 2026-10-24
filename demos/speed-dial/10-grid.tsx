import '@rubenchodev/materix-ui/utilities.css';
import { Grid } from '@rubenchodev/materix-react/components/grid';
import { SpeedDial, SpeedDialAction } from '@rubenchodev/materix-react/components/speed-dial';

export const title = { en: 'Grid layout', es: 'Maquetación en grilla' };
export const description = {
  en: '`Grid` panels (one per row on mobile, two from 900px), each with its SpeedDial in the corner.',
  es: 'Paneles en `Grid` (uno por fila en móvil, dos desde 900px), cada uno con su SpeedDial en la esquina.',
};

/** Esquina inferior derecha del panel (utilidades de posición). */
const corner = 'mtx-position-absolute mtx-right-0 mtx-bottom-0 mtx-m-2';

export default function Demo() {
  return (
    <Grid container spacing={2} className="mtx-w-100">
      <Grid size={{ xs: 12, md: 6 }}>
        <div className="demo-panel demo-panel--tall">
          <span className="demo-label mtx-d-block mtx-m-2">Documents</span>
          <SpeedDial ariaLabel="New document" icon="note_add" className={corner}>
            <SpeedDialAction icon="description" tooltipTitle="Document" />
            <SpeedDialAction icon="table_chart" tooltipTitle="Spreadsheet" />
          </SpeedDial>
        </div>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <div className="demo-panel demo-panel--tall">
          <span className="demo-label mtx-d-block mtx-m-2">Contacts</span>
          <SpeedDial ariaLabel="New contact" icon="person_add" color="secondary" className={corner}>
            <SpeedDialAction icon="person" color="primary" tooltipTitle="Person" />
            <SpeedDialAction icon="groups" color="primary" tooltipTitle="Group" />
          </SpeedDial>
        </div>
      </Grid>
    </Grid>
  );
}
