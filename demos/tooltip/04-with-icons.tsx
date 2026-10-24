import { Tooltip } from '@rubenchodev/materix-react/components/tooltip';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Fab } from '@rubenchodev/materix-react/components/fab';

export const title = { en: 'With and without icons', es: 'Con y sin iconos' };
export const description = {
  en: 'It works on text buttons, buttons with `startIcon` or `endIcon` and, above all, on icon-only buttons (IconButton in its three sizes and Fab), where it also provides the accessible name.',
  es: 'Funciona en botones de texto, con `startIcon` o `endIcon` y, sobre todo, en botones de solo icono (IconButton en sus tres tamaños y Fab), donde además aporta el nombre accesible.',
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">No icon</span>
        <div className="demo-row">
          <Tooltip title="Discards your changes">
            <Button variant="text">Cancel</Button>
          </Tooltip>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Start / end icon</span>
        <div className="demo-row">
          <Tooltip title="PDF or PNG, 5 MB max.">
            <Button variant="outlined" startIcon="upload">
              Upload
            </Button>
          </Tooltip>
          <Tooltip title="Will be sent to 3 recipients">
            <Button variant="contained" endIcon="send">
              Send
            </Button>
          </Tooltip>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Icon only · IconButton and Fab</span>
        <div className="demo-row">
          <Tooltip title="Share">
            <IconButton icon="share" size="small" />
          </Tooltip>
          <Tooltip title="Share">
            <IconButton icon="share" />
          </Tooltip>
          <Tooltip title="Share">
            <IconButton icon="share" size="large" />
          </Tooltip>
          <Tooltip title="New document" placement="right">
            <Fab icon="add" />
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
