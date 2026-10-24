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
        <span className="demo-label">First and last</span>
        <Pagination count={10} defaultPage={5} showFirstButton showLastButton aria-label="With first and last" />
      </div>
      <div className="demo-group">
        <span className="demo-label">Without previous or next</span>
        <Pagination count={10} defaultPage={5} hidePrevButton hideNextButton aria-label="Without previous and next" />
      </div>
    </div>
  );
}
