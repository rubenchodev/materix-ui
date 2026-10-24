import { Card } from '@rubenchodev/materix-react/components/card';
import { Paper } from '@rubenchodev/materix-react/components/paper';
import { Skeleton } from '@rubenchodev/materix-react/components/skeleton';

export const title = { en: 'Real-world examples', es: 'Ejemplos reales' };
export const description = {
  en: 'A video card and a message list while loading (patterns from the MUI documentation).',
  es: 'Una tarjeta de vídeo y una lista de mensajes mientras cargan (patrones de la documentación de MUI).',
};

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <Card elevation={1}>
        <Skeleton variant="rectangular" height={160} animation="wave" />
        <div className="mtx-p-2 mtx-d-flex mtx-gap-2">
          <Skeleton variant="circular" width={40} height={40} animation="wave" />
          <div className="mtx-flex-1">
            <Skeleton animation="wave" />
            <Skeleton width="60%" animation="wave" />
          </div>
        </div>
      </Card>
      <Paper variant="outlined" className="mtx-p-2">
        <div className="mtx-d-flex mtx-flex-column mtx-gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="mtx-d-flex mtx-align-items-center mtx-gap-2">
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton lines={2} className="mtx-flex-1" />
            </div>
          ))}
        </div>
      </Paper>
    </div>
  );
}
