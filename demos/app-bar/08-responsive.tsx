import '@rubenchodev/materix-ui/components/typography.css';
import { AppBar } from '@rubenchodev/materix-react/components/app-bar';
import { Avatar } from '@rubenchodev/materix-react/components/avatar';
import { Button } from '@rubenchodev/materix-react/components/button';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';
import { Menu, MenuItem, useMenu } from '@rubenchodev/materix-react/components/menu';

export const title = { en: 'Responsive', es: 'Responsive' };
export const description = {
  en: 'The Toolbar changes height and gutters at 600px. For navigation, show text links on wide screens and an icon with a Menu on narrow ones (`mtx-d-md-none` / `mtx-d-md-flex` utilities; resize the window below 900px).',
  es: 'La Toolbar cambia de altura y márgenes a 600px. Para la navegación, muestra enlaces de texto en pantallas anchas y un icono con un Menu en las estrechas (utilidades `mtx-d-md-none` / `mtx-d-md-flex`; reduce la ventana por debajo de 900px).',
};

const sections = [
  { icon: 'inventory_2', label: 'Products' },
  { icon: 'payments', label: 'Pricing' },
  { icon: 'article', label: 'Blog' },
];

export default function Demo() {
  const nav = useMenu();
  const account = useMenu();
  return (
    <div className="demo-stack">
      <AppBar position="static" color="primary">
        <span className="mtx-d-md-none">
          <IconButton className="mtx-toolbar__navigation-icon" icon="menu" aria-label="Open navigation" {...nav.triggerProps} />
        </span>
        <a href="#responsive" className="mtx-d-inline-flex mtx-align-items-center mtx-gap-1 mtx-me-3 mtx-color-inherit mtx-text-decoration-none mtx-typography--h6">
          <span className="material-icons" aria-hidden="true">
            adb
          </span>
          LOGO
        </a>
        <nav className="mtx-d-none mtx-d-md-flex mtx-gap-1 mtx-flex-1" aria-label="Sections">
          {sections.map(({ label }) => (
            <Button key={label} variant="text">
              {label}
            </Button>
          ))}
        </nav>
        <span className="mtx-toolbar__spacer mtx-d-md-none" />
        <IconButton {...account.triggerProps}>
          <Avatar size="small" color="secondary" aria-hidden="true">
            RS
          </Avatar>
          <span className="mtx-visually-hidden">Open account settings</span>
        </IconButton>
      </AppBar>
      <Menu {...nav.menuProps}>
        {sections.map(({ icon, label }) => (
          <MenuItem key={label} icon={icon}>
            {label}
          </MenuItem>
        ))}
      </Menu>
      <Menu {...account.menuProps}>
        <MenuItem icon="account_circle">Profile</MenuItem>
        <MenuItem icon="dashboard">Dashboard</MenuItem>
        <MenuItem icon="logout">Logout</MenuItem>
      </Menu>
    </div>
  );
}
