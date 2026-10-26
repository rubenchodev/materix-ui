import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'Margins and truncation', es: 'Márgenes y truncado' };
export const description = {
  en: '`gutterBottom` adds a 0.35em bottom margin; `paragraph` (class `mtx-typography--paragraph`) adds 16px; `noWrap` truncates to a single line with an ellipsis.',
  es: '`gutterBottom` añade un margen inferior de 0.35em; `paragraph` (clase `mtx-typography--paragraph`) añade 16px; `noWrap` trunca a una sola línea con puntos suspensivos.',
};

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">gutterBottom y paragraph</span>
        <div className="demo-panel">
          <div>
            <Typography variant="subtitle2" gutterBottom>
              Título con gutterBottom
            </Typography>
            <Typography variant="body2" paragraph>
              Párrafo con margen inferior de 16px (paragraph).
            </Typography>
            <Typography variant="body2">Párrafo siguiente.</Typography>
          </div>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">noWrap</span>
        <div className="demo-panel">
          <Typography noWrap className="demo-fixed-width">
            Texto muy largo que no cabe en una sola línea y se trunca con puntos suspensivos.
          </Typography>
        </div>
      </div>
    </div>
  );
}
