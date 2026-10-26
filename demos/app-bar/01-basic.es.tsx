import { AppBar } from '@rubenchodev/materix-react/components/app-bar';
import { Button } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: '`title`, `startIcon` and `endIcon` generate the `Toolbar`, the title and the IconButtons; children go after the title. The bar is `fixed` by default: these demos use `position="static"` so it stays inside the page.',
  es: '`title`, `startIcon` y `endIcon` generan la `Toolbar`, el título y los IconButton; los hijos van tras el título. La barra es `fixed` por defecto: estas demos usan `position="static"` para que quede dentro de la página.',
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <AppBar position="static" color="primary" title="Noticias" startIcon="menu">
        <Button variant="text">Entrar</Button>
      </AppBar>
    </div>
  );
}
