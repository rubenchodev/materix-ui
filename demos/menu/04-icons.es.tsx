import { Button } from '@rubenchodev/materix-react/components/button';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';
import { Menu, MenuItem, useMenu } from '@rubenchodev/materix-react/components/menu';

export const title = { en: 'With and without icons', es: 'Con y sin iconos' };
export const description = {
  en: '`icon` inserts the icon before the text (a Material Icons name or any node). The icon-only trigger (`more_vert`) has an `aria-label`.',
  es: '`icon` inserta el icono antes del texto (nombre de Material Icons o cualquier nodo). El disparador de solo icono (`more_vert`) lleva `aria-label`.',
};

export default function Demo() {
  const plain = useMenu();
  const icons = useMenu();
  const kebab = useMenu();
  return (
    <div className="demo-row">
      <div className="demo-group">
        <span className="demo-label">Sin icono</span>
        <div className="demo-row">
          <Button variant="outlined" {...plain.triggerProps}>
            Opciones
          </Button>
          <Menu {...plain.menuProps}>
            <MenuItem>Editar</MenuItem>
            <MenuItem>Duplicar</MenuItem>
            <MenuItem>Eliminar</MenuItem>
          </Menu>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Con icono</span>
        <div className="demo-row">
          <Button variant="outlined" {...icons.triggerProps}>
            Opciones
          </Button>
          <Menu {...icons.menuProps}>
            <MenuItem icon="edit">Editar</MenuItem>
            <MenuItem icon="content_copy">Duplicar</MenuItem>
            <MenuItem icon="delete">Eliminar</MenuItem>
          </Menu>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Disparador de solo icono</span>
        <div className="demo-row">
          <IconButton icon="more_vert" aria-label="Más opciones" {...kebab.triggerProps} />
          <Menu {...kebab.menuProps}>
            <MenuItem icon="share">Compartir</MenuItem>
            <MenuItem icon="download">Descargar</MenuItem>
            <MenuItem icon="flag">Denunciar</MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
}
