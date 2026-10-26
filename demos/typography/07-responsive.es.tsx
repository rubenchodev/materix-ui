import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'Responsive typography', es: 'Tipografía responsive' };
export const description = {
  en: 'Variant per breakpoint (mobile-first: sm 600, md 900, lg 1200, xl 1536px) with `variantSm`…`variantXl`; and fluid h1–h6 scaling with `responsive` (like MUI\'s `responsiveFontSizes`). Resize the window to see it.',
  es: 'Variante por breakpoint (mobile-first: sm 600, md 900, lg 1200, xl 1536px) con `variantSm`…`variantXl`; y escala fluida de h1–h6 con `responsive` (como `responsiveFontSizes` de MUI). Cambia el tamaño de la ventana para verlo.',
};

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">Por breakpoint · h5 → md h4 → lg h3</span>
        <div className="demo-panel">
          <div>
            <Typography component="h2" variant="h5" variantMd="h4" variantLg="h3" gutterBottom>
              Novedades de octubre
            </Typography>
            <Typography variant="body2" variantMd="body1">
              body2 en móvil, body1 desde 900px
            </Typography>
          </div>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Escala fluida · clamp()</span>
        <div className="demo-panel">
          <div>
            <Typography component="h2" variant="h2" responsive gutterBottom>
              Titular fluido
            </Typography>
            <Typography component="h3" variant="h4" responsive>
              Subtítulo fluido
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
