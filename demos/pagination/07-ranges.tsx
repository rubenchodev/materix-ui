import { Pagination } from '@rubenchodev/materix-react/components/pagination';

export const title = { en: 'Pagination ranges', es: 'Rangos de paginación' };
export const description = {
  en: "`siblingCount` sets how many pages are shown on each side of the current one and `boundaryCount` how many are always shown at the beginning and the end.",
  es: "`siblingCount` fija cuántas páginas se ven a cada lado de la actual y `boundaryCount` cuántas se ven siempre al principio y al final.",
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">Default · siblingCount 1 · boundaryCount 1</span>
        <Pagination count={11} defaultPage={6} aria-label="Default range" />
      </div>
      <div className="demo-group">
        <span className="demo-label">siblingCount 0</span>
        <Pagination count={11} defaultPage={6} siblingCount={0} aria-label="No siblings" />
      </div>
      <div className="demo-group">
        <span className="demo-label">siblingCount 2</span>
        <Pagination count={11} defaultPage={6} siblingCount={2} aria-label="Two siblings" />
      </div>
      <div className="demo-group">
        <span className="demo-label">boundaryCount 2</span>
        <Pagination count={11} defaultPage={6} boundaryCount={2} aria-label="Two boundary pages" />
      </div>
    </div>
  );
}
