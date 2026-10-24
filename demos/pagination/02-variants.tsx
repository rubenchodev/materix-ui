import { Pagination } from '@rubenchodev/materix-react/components/pagination';

export const title = { en: 'Variants', es: 'Variantes' };
export const description = {
  en: "`variant=\"text\"` (default) has no border; `variant=\"outlined\"` draws a border on every item and tints the selected one with the palette color.",
  es: "`variant=\"text\"` (por defecto) no tiene borde; `variant=\"outlined\"` dibuja un borde en cada ítem y tiñe el seleccionado con el color de la paleta.",
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">text</span>
        <Pagination count={10} defaultPage={4} aria-label="Text variant" />
        <Pagination count={10} defaultPage={4} color="primary" aria-label="Text variant, primary" />
      </div>
      <div className="demo-group">
        <span className="demo-label">outlined</span>
        <Pagination count={10} defaultPage={4} variant="outlined" aria-label="Outlined variant" />
        <Pagination count={10} defaultPage={4} variant="outlined" color="primary" aria-label="Outlined variant, primary" />
        <Pagination count={10} defaultPage={4} variant="outlined" color="secondary" aria-label="Outlined variant, secondary" />
        <Pagination count={10} defaultPage={4} variant="outlined" disabled aria-label="Outlined variant, disabled" />
      </div>
    </div>
  );
}
