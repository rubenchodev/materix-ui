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
        <span className="demo-label">Without icon</span>
        <div className="demo-row">
          <Button variant="outlined" {...plain.triggerProps}>
            Options
          </Button>
          <Menu {...plain.menuProps}>
            <MenuItem>Edit</MenuItem>
            <MenuItem>Duplicate</MenuItem>
            <MenuItem>Delete</MenuItem>
          </Menu>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">With icon</span>
        <div className="demo-row">
          <Button variant="outlined" {...icons.triggerProps}>
            Options
          </Button>
          <Menu {...icons.menuProps}>
            <MenuItem icon="edit">Edit</MenuItem>
            <MenuItem icon="content_copy">Duplicate</MenuItem>
            <MenuItem icon="delete">Delete</MenuItem>
          </Menu>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Icon-only trigger</span>
        <div className="demo-row">
          <IconButton icon="more_vert" aria-label="More options" {...kebab.triggerProps} />
          <Menu {...kebab.menuProps}>
            <MenuItem icon="share">Share</MenuItem>
            <MenuItem icon="download">Download</MenuItem>
            <MenuItem icon="flag">Report</MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
}
