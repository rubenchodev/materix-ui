import { AppBar, Toolbar, ToolbarTitle } from '@rubenchodev/materix-react/components/app-bar';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';

export const title = { en: 'Composition with Toolbar', es: 'Composición con Toolbar' };
export const description = {
  en: 'With a `Toolbar` among the children no Toolbar is generated (the equivalent of the vanilla BEM syntax): use it for several Toolbars, prominent bars or full control of the content.',
  es: 'Con una `Toolbar` entre los hijos no se genera ninguna (el equivalente de la sintaxis BEM vanilla): úsala para varias Toolbar, barras prominent o el control total del contenido.',
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <AppBar position="static" color="primary">
        <Toolbar variant="prominent">
          <IconButton className="mtx-toolbar__navigation-icon" icon="menu" aria-label="Open navigation" />
          <ToolbarTitle>Prominent title</ToolbarTitle>
          <IconButton icon="search" aria-label="Search" />
        </Toolbar>
      </AppBar>
      <AppBar position="static" color="secondary">
        <Toolbar variant="dense">
          <ToolbarTitle>First toolbar</ToolbarTitle>
        </Toolbar>
        <Toolbar variant="dense">
          <ToolbarTitle>Second toolbar</ToolbarTitle>
          <IconButton icon="filter_list" aria-label="Filter" />
        </Toolbar>
      </AppBar>
    </div>
  );
}
