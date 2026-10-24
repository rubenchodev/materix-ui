import './demo.css';
import { Grid } from '@rubenchodev/materix-react/components/grid';

export const title = { en: 'Responsive spacing', es: 'Espaciado responsive' };

export const description = {
  en: '`spacing`, `rowSpacing` and `columnSpacing` accept an object per breakpoint: here 8px on mobile, 24px from 900px and 40px from 1200px.',
  es: '`spacing`, `rowSpacing` y `columnSpacing` aceptan un objeto por breakpoint: aquí 8px en móvil, 24px desde 900px y 40px desde 1200px.',
};

export default function Demo() {
  return (
    <Grid container spacing={{ xs: 1, md: 3, lg: 5 }}>
      {[1, 2, 3, 4].map((n) => (
        <Grid key={n} size={{ xs: 6, md: 3 }}>
          <div className="demo-grid-item">8 → 24 → 40px</div>
        </Grid>
      ))}
    </Grid>
  );
}
