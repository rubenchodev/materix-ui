import { IconButton } from '@rubenchodev/materix-react/components/icon-button';

export const title = { en: 'Colors', es: 'Colores' };
export const description = {
  en: 'Without `color` the icon uses the active action gray (`--mtx-color-action-active`), as in MUI. `color` takes a palette color; `inherit` inherits the color of the surrounding text.',
  es: 'Sin `color` el icono usa el gris de acción activa (`--mtx-color-action-active`), como en MUI. `color` toma un color de la paleta; `inherit` hereda el color del texto que lo rodea.',
};

const colors = ['primary', 'secondary', 'success', 'error', 'warning', 'info'] as const;

/** Nombre accesible en español de cada color de la paleta. */
const colorLabels: Record<(typeof colors)[number], string> = {
  primary: 'Primario',
  secondary: 'Secundario',
  success: 'Éxito',
  error: 'Error',
  warning: 'Advertencia',
  info: 'Información',
};

export default function Demo() {
  return (
    <>
      <div className="demo-row">
        <IconButton icon="star" aria-label="Por defecto" />
        {colors.map((color) => (
          <IconButton key={color} icon="star" color={color} aria-label={colorLabels[color]} />
        ))}
      </div>
      <div className="demo-group">
        <span className="demo-label">inherit · hereda el color del contenedor</span>
        <div className="mtx-bg-primary mtx-d-flex mtx-flex-wrap mtx-align-items-center mtx-gap-2 mtx-p-2 mtx-rounded">
          <IconButton icon="menu" color="inherit" edge="start" aria-label="Abrir menú" />
          <span className="mtx-flex-1">Panel</span>
          <IconButton icon="search" color="inherit" aria-label="Buscar" />
        </div>
      </div>
    </>
  );
}
