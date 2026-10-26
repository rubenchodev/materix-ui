import { Pagination } from '@rubenchodev/materix-react/components/pagination';

export const title = { en: 'Shapes', es: 'Formas' };
export const description = {
  en: "`shape=\"circular\"` (default) or `shape=\"rounded\"` with the 4px MUI radius.",
  es: "`shape=\"circular\"` (por defecto) o `shape=\"rounded\"` con el radio de 4px de MUI.",
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">circular</span>
        <Pagination count={10} defaultPage={2} color="primary" aria-label="Circular" />
      </div>
      <div className="demo-group">
        <span className="demo-label">rounded</span>
        <Pagination count={10} defaultPage={2} shape="rounded" color="primary" aria-label="Redondeada" />
        <Pagination count={10} defaultPage={2} shape="rounded" variant="outlined" aria-label="Redondeada con borde" />
      </div>
    </div>
  );
}
