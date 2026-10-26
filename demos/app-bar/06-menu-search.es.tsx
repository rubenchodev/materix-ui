import { AppBar, ToolbarTitle } from '@rubenchodev/materix-react/components/app-bar';
import { Badge } from '@rubenchodev/materix-react/components/badge';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';
import { Menu, MenuItem, useMenu } from '@rubenchodev/materix-react/components/menu';
import { TextField } from '@rubenchodev/materix-react/components/text-field';

export const title = { en: 'Menu and search', es: 'Menú y búsqueda' };
export const description = {
  en: 'Actions open a `Menu` with `useMenu()`. For search, use the `.mtx-app-bar-search` pattern (40px tall; its colors derive from the bar color, in the dark theme too) or a `TextField` with `variant="no-label"` and `size="small"`. `--grow` fills the free space (up to 560px) without changing width on focus.',
  es: 'Las acciones abren un `Menu` con `useMenu()`. Para buscar, usa el patrón `.mtx-app-bar-search` (40px de alto; sus colores derivan del color de la barra, también en el tema oscuro) o un `TextField` con `variant="no-label"` y `size="small"`. `--grow` ocupa el espacio libre (hasta 560px) sin cambiar de ancho al enfocar.',
};

/**
 * Campo de búsqueda con el patrón `.mtx-app-bar-search`.
 * @param {{ label: string; placeholder: string; modifier: string }} props Etiqueta, placeholder y modificador.
 * @returns {JSX.Element} Campo.
 */
function Search({ label, placeholder, modifier }: { label: string; placeholder: string; modifier: string }) {
  return (
    <div className={`mtx-app-bar-search mtx-app-bar-search--${modifier}`} role="search">
      <span className="material-icons" aria-hidden="true">
        search
      </span>
      <input type="search" placeholder={placeholder} aria-label={label} />
    </div>
  );
}

export default function Demo() {
  const account = useMenu();
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <p className="demo-label">Menú de cuenta</p>
        <AppBar position="static" color="primary" startIcon="menu" title="Fotos">
          <IconButton icon="account_circle" aria-label="Cuenta de usuario" {...account.triggerProps} />
        </AppBar>
        <Menu {...account.menuProps}>
          <MenuItem icon="person">Perfil</MenuItem>
          <MenuItem icon="manage_accounts">Mi cuenta</MenuItem>
          <MenuItem icon="logout">Cerrar sesión</MenuItem>
        </Menu>
      </div>
      <div className="demo-group">
        <p className="demo-label">Búsqueda (.mtx-app-bar-search)</p>
        <AppBar position="static" color="primary" startIcon="menu" title="Panel">
          <Search label="Buscar" placeholder="Buscar…" modifier="right" />
          <Badge badgeContent={4} color="error">
            <IconButton icon="notifications" aria-label="4 notificaciones" />
          </Badge>
        </AppBar>
      </div>
      <div className="demo-group">
        <p className="demo-label">Búsqueda centrada · color default</p>
        <AppBar position="static" color="default">
          <ToolbarTitle>Drive</ToolbarTitle>
          <Search label="Buscar en Drive" placeholder="Buscar en Drive" modifier="centered" />
          <IconButton icon="settings" aria-label="Ajustes" />
        </AppBar>
      </div>
      <div className="demo-group">
        <p className="demo-label">Búsqueda que crece (--grow) · primary</p>
        <AppBar position="static" color="primary" startIcon="menu" title="Pedidos">
          <Search label="Buscar pedidos o clientes" placeholder="Buscar pedidos o clientes…" modifier="grow" />
          <IconButton icon="notifications" aria-label="Notificaciones" />
        </AppBar>
      </div>
      <div className="demo-group">
        <p className="demo-label">Búsqueda que crece (--grow) · default plana</p>
        <AppBar position="static" color="default" elevation={0} startIcon="menu" title="Archivos">
          <Search label="Buscar en Drive" placeholder="Buscar en Drive" modifier="grow" />
          <IconButton icon="settings" aria-label="Ajustes" />
        </AppBar>
      </div>
      <div className="demo-group">
        <p className="demo-label">TextField no-label · small</p>
        <AppBar position="static" color="primary" title="Catálogo">
          <TextField
            variant="no-label"
            size="small"
            startIcon="search"
            type="search"
            placeholder="Buscar productos…"
            aria-label="Buscar productos"
          />
          <IconButton icon="shopping_cart" aria-label="Carrito" />
        </AppBar>
      </div>
    </div>
  );
}
