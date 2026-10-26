import { Button } from '@rubenchodev/materix-react/components/button';
import { Chip } from '@rubenchodev/materix-react/components/chip';
import { Fab } from '@rubenchodev/materix-react/components/fab';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';
import { TextField } from '@rubenchodev/materix-react/components/text-field';

export const title = { en: 'Sizes', es: 'Tamaños' };
export const description = {
  en: "Three canonical heights with `size`: large 48px, medium 40px (default) and small 32px. Each row aligns the button with other controls of the same height to check that they share the baseline.",
  es: "Tres alturas canónicas con `size`: large 48px, medium 40px (por defecto) y small 32px. Cada fila alinea el botón con otros controles de la misma altura para comprobar que comparten la línea base.",
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">Large · 48px — junto a IconButton large y FAB medium (48px)</span>
        <div className="demo-row">
          <Button variant="contained" size="large">Buscar</Button>
          <Button variant="outlined" size="large">Filtros</Button>
          <Button size="large">Limpiar</Button>
          <IconButton icon="tune" size="large" aria-label="Ajustes de búsqueda" />
          <Fab icon="add" size="medium" aria-label="Crear" />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Medium · 40px (por defecto) — junto a TextField small (40px)</span>
        <div className="demo-row">
          <div className="demo-fixed-width">
            <TextField label="Correo electrónico" size="small" type="email" />
          </div>
          <Button variant="contained">Suscribirme</Button>
          <Button variant="outlined">Omitir</Button>
          <IconButton icon="help_outline" aria-label="Ayuda" />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Small · 32px — junto a IconButton small y Chip (32px)</span>
        <div className="demo-row">
          <Button variant="contained" size="small">Filtrar</Button>
          <Button variant="outlined" size="small">Exportar</Button>
          <Button size="small">Restablecer</Button>
          <IconButton icon="more_vert" size="small" aria-label="Más opciones" />
          <Chip label="Activo" variant="outlined" />
        </div>
      </div>
    </div>
  );
}
