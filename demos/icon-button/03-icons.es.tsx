import { IconButton } from '@rubenchodev/materix-react/components/icon-button';

export const title = { en: 'Icons', es: 'Iconos' };
export const description = {
  en: '`icon` accepts a Material Icons name or any node (SVG, Material Symbols). You can also write the icon as `children`, which takes priority over `icon`. With `href` it renders an `<a>` without underline.',
  es: '`icon` acepta un nombre de Material Icons o cualquier nodo (SVG, Material Symbols). También puedes escribir el icono como `children`, que tiene prioridad sobre `icon`. Con `href` renderiza un `<a>` sin subrayado.',
};

const githubPath =
  'M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z';

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">Con icono</span>
        <div className="demo-row">
          <IconButton icon="home" aria-label="Inicio" />
          <IconButton icon="settings" aria-label="Ajustes" />
          <IconButton icon="notifications" aria-label="Notificaciones" />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Icono anidado (children)</span>
        <div className="demo-row">
          <IconButton aria-label="Imprimir">
            <span className="material-icons" aria-hidden="true">
              print
            </span>
          </IconButton>
          <IconButton aria-label="Descargar">
            <span className="material-icons" aria-hidden="true">
              download
            </span>
          </IconButton>
          <IconButton aria-label="Abrir en una ventana nueva">
            <span className="material-icons" aria-hidden="true">
              open_in_new
            </span>
          </IconButton>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">SVG de 24px · como enlace &lt;a&gt; (sin subrayado)</span>
        <div className="demo-row">
          <IconButton
            aria-label="GitHub"
            icon={
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d={githubPath} />
              </svg>
            }
          />
          <IconButton href="#icons" icon="link" aria-label="Enlace a esta sección" />
        </div>
      </div>
    </div>
  );
}
