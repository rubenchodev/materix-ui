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
        <span className="demo-label">Sin icono</span>
        <div className="demo-row">
          <Tooltip title="Descarta tus cambios">
            <Button variant="text">Cancelar</Button>
          </Tooltip>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Icono inicial / final</span>
        <div className="demo-row">
          <Tooltip title="PDF o PNG, máx. 5 MB.">
            <Button variant="outlined" startIcon="upload">
              Subir
            </Button>
          </Tooltip>
          <Tooltip title="Se enviará a 3 destinatarios">
            <Button variant="contained" endIcon="send">
              Enviar
            </Button>
          </Tooltip>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Solo icono · IconButton y Fab</span>
        <div className="demo-row">
          <Tooltip title="Compartir">
            <IconButton icon="share" size="small" />
          </Tooltip>
          <Tooltip title="Compartir">
            <IconButton icon="share" />
          </Tooltip>
          <Tooltip title="Compartir">
            <IconButton icon="share" size="large" />
          </Tooltip>
          <Tooltip title="Nuevo documento" placement="right">
            <Fab icon="add" />
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
