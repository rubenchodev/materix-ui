import './demo.css';
import { Grid, type GridAlign, type GridJustify } from '@rubenchodev/materix-react/components/grid';

export const title = { en: 'Alignment', es: 'Alineación' };

export const description = {
  en: '`justifyContent` distributes the items horizontally and `alignItems` aligns them vertically when they have different heights.',
  es: '`justifyContent` distribuye los ítems en horizontal y `alignItems` los alinea en vertical cuando tienen alturas distintas.',
};

const justify: GridJustify[] = ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'];
const align: GridAlign[] = ['flex-start', 'center', 'flex-end', 'stretch'];

export default function Demo() {
  return (
    <div className="demo-stack">
      {justify.map((value) => (
        <div className="demo-group" key={value}>
          <span className="demo-label">justifyContent=&quot;{value}&quot;</span>
          <Grid container spacing={2} justifyContent={value}>
            <Grid size={3}>
              <div className="demo-grid-item">{value}</div>
            </Grid>
            <Grid size={3}>
              <div className="demo-grid-item">{value}</div>
            </Grid>
          </Grid>
        </div>
      ))}
      {align.map((value) => (
        <div className="demo-group" key={value}>
          <span className="demo-label">alignItems=&quot;{value}&quot;</span>
          <Grid container spacing={2} alignItems={value}>
            <Grid size={4}>
              <div className="demo-grid-item">short</div>
            </Grid>
            <Grid size={4}>
              <div className="demo-grid-item demo-grid-item--tall demo-grid-item--alt">tall</div>
            </Grid>
            <Grid size={4}>
              <div className="demo-grid-item">short</div>
            </Grid>
          </Grid>
        </div>
      ))}
    </div>
  );
}
