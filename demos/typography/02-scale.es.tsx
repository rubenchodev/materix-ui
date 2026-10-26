import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'Type scale', es: 'Escala tipográfica' };
export const description = {
  en: 'The 13 MUI variants with their size, weight and line height. As in MUI, no variant has a margin (h1–h6 included): add one with `gutterBottom` or `paragraph`. The headings in this demo use `component="p"` so the page hierarchy is not altered.',
  es: 'Las 13 variantes de MUI con su tamaño, peso y altura de línea. Como en MUI, ninguna variante tiene margen (h1–h6 incluidas): añádelo con `gutterBottom` o `paragraph`. Los encabezados de esta demo usan `component="p"` para no alterar la jerarquía de la página.',
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">h1 · 96px / 300</span>
        <Typography variant="h1" component="p">
          h1. Título
        </Typography>
      </div>
      <div className="demo-group">
        <span className="demo-label">h2 · 60px / 300</span>
        <Typography variant="h2" component="p">
          h2. Título
        </Typography>
      </div>
      <div className="demo-group">
        <span className="demo-label">h3 · 48px / 400</span>
        <Typography variant="h3" component="p">
          h3. Título
        </Typography>
      </div>
      <div className="demo-group">
        <span className="demo-label">h4 · 34px / 400</span>
        <Typography variant="h4" component="p">
          h4. Título de sección
        </Typography>
      </div>
      <div className="demo-group">
        <span className="demo-label">h5 · 24px / 400</span>
        <Typography variant="h5" component="p">
          h5. Título de sección
        </Typography>
      </div>
      <div className="demo-group">
        <span className="demo-label">h6 · 20px / 500</span>
        <Typography variant="h6" component="p">
          h6. Título de sección
        </Typography>
      </div>
      <div className="demo-group">
        <span className="demo-label">subtitle1 · 16px / 400 · subtitle2 · 14px / 500</span>
        <Typography variant="subtitle1">subtitle1. Texto de apoyo para títulos y secciones.</Typography>
        <Typography variant="subtitle2">subtitle2. Texto de apoyo compacto con más peso.</Typography>
      </div>
      <div className="demo-group">
        <span className="demo-label">body1 · 16px / 400 · body2 · 14px / 400</span>
        <Typography variant="body1">
          body1. Texto principal de la aplicación, pensado para lectura continua con un interlineado cómodo.
        </Typography>
        <Typography variant="body2">body2. Texto secundario para descripciones, notas y metadatos.</Typography>
      </div>
      <div className="demo-group">
        <span className="demo-label">button · 14px / 500 · caption · 12px · overline · 12px</span>
        <Typography variant="button">button. Texto de botón</Typography>
        <Typography variant="caption">caption. Pie de foto o texto de ayuda.</Typography>
        <Typography variant="overline">overline. Categoría o etiqueta superior</Typography>
      </div>
    </div>
  );
}
