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
        <p className="demo-label">Account menu</p>
        <AppBar position="static" color="primary" startIcon="menu" title="Photos">
          <IconButton icon="account_circle" aria-label="User account" {...account.triggerProps} />
        </AppBar>
        <Menu {...account.menuProps}>
          <MenuItem icon="person">Profile</MenuItem>
          <MenuItem icon="manage_accounts">My account</MenuItem>
          <MenuItem icon="logout">Logout</MenuItem>
        </Menu>
      </div>
      <div className="demo-group">
        <p className="demo-label">Search (.mtx-app-bar-search)</p>
        <AppBar position="static" color="primary" startIcon="menu" title="Dashboard">
          <Search label="Search" placeholder="Search…" modifier="right" />
          <Badge badgeContent={4} color="error">
            <IconButton icon="notifications" aria-label="4 notifications" />
          </Badge>
        </AppBar>
      </div>
      <div className="demo-group">
        <p className="demo-label">Centered search · default color</p>
        <AppBar position="static" color="default">
          <ToolbarTitle>Drive</ToolbarTitle>
          <Search label="Search in Drive" placeholder="Search in Drive" modifier="centered" />
          <IconButton icon="settings" aria-label="Settings" />
        </AppBar>
      </div>
      <div className="demo-group">
        <p className="demo-label">Growing search (--grow) · primary</p>
        <AppBar position="static" color="primary" startIcon="menu" title="Orders">
          <Search label="Search orders or customers" placeholder="Search orders or customers…" modifier="grow" />
          <IconButton icon="notifications" aria-label="Notifications" />
        </AppBar>
      </div>
      <div className="demo-group">
        <p className="demo-label">Growing search (--grow) · flat default</p>
        <AppBar position="static" color="default" elevation={0} startIcon="menu" title="Files">
          <Search label="Search in Drive" placeholder="Search in Drive" modifier="grow" />
          <IconButton icon="settings" aria-label="Settings" />
        </AppBar>
      </div>
      <div className="demo-group">
        <p className="demo-label">TextField no-label · small</p>
        <AppBar position="static" color="primary" title="Catalog">
          <TextField
            variant="no-label"
            size="small"
            startIcon="search"
            type="search"
            placeholder="Search products…"
            aria-label="Search products"
          />
          <IconButton icon="shopping_cart" aria-label="Cart" />
        </AppBar>
      </div>
    </div>
  );
}
