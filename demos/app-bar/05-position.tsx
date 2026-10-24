import type { CSSProperties } from 'react';
import { AppBar, ToolbarOffset } from '@rubenchodev/materix-react/components/app-bar';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';

export const title = { en: 'Position', es: 'Posición' };
export const description = {
  en: '`position`: `fixed` (default), `sticky`, `static`, `absolute` and `relative`. Scroll each frame: the fixed one is contained by a `transform` on its frame (on a real page it stays fixed to the window) and starts its content with `ToolbarOffset`. `bottom` anchors an absolute bar to the bottom.',
  es: '`position`: `fixed` (por defecto), `sticky`, `static`, `absolute` y `relative`. Desplaza cada marco: el fijo queda contenido por un `transform` en su marco (en una página real queda fijo a la ventana) y empieza su contenido con `ToolbarOffset`. `bottom` ancla abajo una barra absoluta.',
};

const paragraphs = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
];

/** Marco con scroll propio; `transform` contiene la barra fija. */
const frame: CSSProperties = { height: 280 };
const fixedFrame: CSSProperties = { height: 280, transform: 'translateZ(0)' };
const FRAME = 'mtx-position-relative mtx-overflow-y-auto mtx-border mtx-rounded mtx-bg-default';

/** Párrafos de relleno. */
function Body({ intro }: { intro: string }) {
  return (
    <div className="mtx-p-2 mtx-typography--body2">
      <p className="mtx-mt-0 mtx-mb-2">{intro}</p>
      {paragraphs.map((text) => (
        <p key={text} className="mtx-mt-0 mtx-mb-2">
          {text}
        </p>
      ))}
    </div>
  );
}

export default function Demo() {
  return (
    <div className="demo-grid-2 mtx-w-100">
      <div className="demo-group">
        <p className="demo-label">fixed</p>
        <div className={FRAME} style={fixedFrame} tabIndex={0} role="region" aria-label="Fixed position demo">
          <AppBar color="primary" title="Fixed" />
          <ToolbarOffset />
          <Body intro="The content scrolls beneath the fixed bar." />
        </div>
      </div>
      <div className="demo-group">
        <p className="demo-label">sticky</p>
        <div className={FRAME} style={frame} tabIndex={0} role="region" aria-label="Sticky position demo">
          <p className="mtx-p-2 mtx-m-0 mtx-typography--body2">This paragraph sits above the bar: as you scroll down, the bar sticks to the top.</p>
          <AppBar position="sticky" color="secondary" title="Sticky" />
          <Body intro="The bar stays at the top of the container." />
        </div>
      </div>
      <div className="demo-group">
        <p className="demo-label">static</p>
        <div className={FRAME} style={frame} tabIndex={0} role="region" aria-label="Static position demo">
          <AppBar position="static" color="default" title="Static" />
          <Body intro="The bar is part of the flow and scrolls with the content." />
        </div>
      </div>
      <div className="demo-group">
        <p className="demo-label">absolute · bottom</p>
        <div className={`${FRAME} mtx-overflow-hidden`} style={frame}>
          <p className="mtx-p-2 mtx-m-0 mtx-typography--body2">Bottom bar anchored to the positioned container, typical of mobile apps.</p>
          <AppBar position="absolute" bottom color="primary" startIcon="menu">
            <div className="mtx-toolbar__spacer" />
            <IconButton icon="search" aria-label="Search" />
            <IconButton icon="more_vert" aria-label="More options" />
          </AppBar>
        </div>
      </div>
      <div className="demo-group">
        <p className="demo-label">relative</p>
        <AppBar position="relative" color="default" title="Relative" />
      </div>
    </div>
  );
}
