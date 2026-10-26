import { Pagination } from '@rubenchodev/materix-react/components/pagination';

export const title = { en: 'Navigation buttons', es: 'Botones de navegación' };
export const description = {
  en: "`showFirstButton` and `showLastButton` add the first/last page buttons; `hidePrevButton` and `hideNextButton` hide previous/next.",
  es: "`showFirstButton` y `showLastButton` añaden los botones de primera/última página; `hidePrevButton` y `hideNextButton` ocultan anterior/siguiente.",
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">Primera y última</span>
        <Pagination count={10} defaultPage={5} showFirstButton showLastButton aria-label="Con primera y última" />
      </div>
      <div className="demo-group">
        <span className="demo-label">Sin anterior ni siguiente</span>
        <Pagination count={10} defaultPage={5} hidePrevButton hideNextButton aria-label="Sin anterior ni siguiente" />
      </div>
    </div>
  );
}
