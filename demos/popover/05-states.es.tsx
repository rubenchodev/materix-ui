import { Popover, usePopover } from '@rubenchodev/materix-react/components/popover';
import { Button } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'States', es: 'Estados' };
export const description = {
  en: 'A disabled trigger does not open the popover. Elements with `data-mtx-popover-close` inside the popover close it (reason `action`).',
  es: 'Un disparador deshabilitado no abre el popover. Los elementos con `data-mtx-popover-close` dentro del popover lo cierran (motivo `action`).',
};

export default function Demo() {
  const popover = usePopover();
  return (
    <div className="demo-row">
      <Button variant="contained" disabled {...popover.getTriggerProps({ key: 'disabled' })}>
        Deshabilitado
      </Button>
      <Button variant="contained" {...popover.getTriggerProps()}>
        Con botón de cierre
      </Button>
      <Popover {...popover.popoverProps} className="mtx-p-2">
        <h3 className="mtx-typography--subtitle2 mtx-mb-1">¿Archivar el proyecto?</h3>
        <p className="mtx-typography--body2 mtx-mb-2">Podrás restaurarlo durante 30 días.</p>
        <div className="mtx-d-flex mtx-justify-content-end mtx-gap-1">
          <Button variant="text" data-mtx-popover-close="">
            Cancelar
          </Button>
          <Button variant="contained" data-mtx-popover-close="">
            Archivar
          </Button>
        </div>
      </Popover>
    </div>
  );
}
