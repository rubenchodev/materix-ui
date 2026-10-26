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
        <p className="demo-label">Sin iconos</p>
        <AppBar position="static" color="primary" title="Solo título" />
      </div>
      <div className="demo-group">
        <p className="demo-label">Icono inicial</p>
        <AppBar position="static" color="primary" title="Bandeja de entrada" startIcon="menu" />
      </div>
      <div className="demo-group">
        <p className="demo-label">Icono final</p>
        <AppBar position="static" color="primary" title="Perfil" endIcon="account_circle" endIconLabel="Cuenta de usuario" />
      </div>
      <div className="demo-group">
        <p className="demo-label">Inicial y final, sin título</p>
        <AppBar position="static" color="primary" startIcon="arrow_back" startIconLabel="Volver" endIcon="more_vert" endIconLabel="Más opciones" />
      </div>
      <div className="demo-group">
        <p className="demo-label">Varias acciones como hijos</p>
        <AppBar position="static" color="primary" startIcon="menu">
          <ToolbarTitle>Fotos</ToolbarTitle>
          <IconButton icon="search" aria-label="Buscar" />
          <IconButton icon="more_vert" aria-label="Más opciones" />
        </AppBar>
      </div>
      <div className="demo-group">
        <p className="demo-label">Botones text, outlined y contained</p>
        <AppBar position="static" color="primary" title="Materix">
          <Button variant="text" className="mtx-d-none mtx-d-sm-inline-flex">
            Docs
          </Button>
          <Button variant="outlined">Entrar</Button>
          <Button variant="contained" color="secondary" startIcon="rocket_launch">
            Empezar
          </Button>
        </AppBar>
      </div>
    </div>
  );
}
