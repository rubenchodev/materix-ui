import { AppBar, ToolbarTitle } from '@rubenchodev/materix-react/components/app-bar';
import { Button } from '@rubenchodev/materix-react/components/button';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';

export const title = { en: 'With and without icons', es: 'Con y sin iconos' };
export const description = {
  en: '`startIcon` adds the navigation button and `endIcon` a trailing action, labeled with `startIconLabel`/`endIconLabel` (`menu` defaults to "Open navigation"). For several actions write them as children with `ToolbarTitle`. Text and outlined buttons inherit the bar color; contained ones keep theirs.',
  es: '`startIcon` añade el botón de navegación y `endIcon` una acción final, etiquetados con `startIconLabel`/`endIconLabel` (`menu` usa "Open navigation" por defecto). Para varias acciones escríbelas como hijos con `ToolbarTitle`. Los botones text y outlined heredan el color de la barra; los contained conservan el suyo.',
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <p className="demo-label">No icons</p>
        <AppBar position="static" color="primary" title="Title only" />
      </div>
      <div className="demo-group">
        <p className="demo-label">Start icon</p>
        <AppBar position="static" color="primary" title="Inbox" startIcon="menu" />
      </div>
      <div className="demo-group">
        <p className="demo-label">End icon</p>
        <AppBar position="static" color="primary" title="Profile" endIcon="account_circle" endIconLabel="User account" />
      </div>
      <div className="demo-group">
        <p className="demo-label">Start and end, no title</p>
        <AppBar position="static" color="primary" startIcon="arrow_back" startIconLabel="Back" endIcon="more_vert" endIconLabel="More options" />
      </div>
      <div className="demo-group">
        <p className="demo-label">Several actions as children</p>
        <AppBar position="static" color="primary" startIcon="menu">
          <ToolbarTitle>Photos</ToolbarTitle>
          <IconButton icon="search" aria-label="Search" />
          <IconButton icon="more_vert" aria-label="More options" />
        </AppBar>
      </div>
      <div className="demo-group">
        <p className="demo-label">Text, outlined and contained buttons</p>
        <AppBar position="static" color="primary" title="Materix">
          <Button variant="text" className="mtx-d-none mtx-d-sm-inline-flex">
            Docs
          </Button>
          <Button variant="outlined">Login</Button>
          <Button variant="contained" color="secondary" startIcon="rocket_launch">
            Get started
          </Button>
        </AppBar>
      </div>
    </div>
  );
}
