import { Popover, usePopover } from '@rubenchodev/materix-react/components/popover';
import { Avatar } from '@rubenchodev/materix-react/components/avatar';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Checkbox } from '@rubenchodev/materix-react/components/checkbox';
import { Divider } from '@rubenchodev/materix-react/components/divider';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';

export const title = { en: 'Use cases', es: 'Casos de uso' };
export const description = {
  en: 'Table filters and an account card opened from an avatar, aligned to the end.',
  es: 'Filtros de una tabla y una tarjeta de cuenta abierta desde un avatar, alineada al final.',
};

export default function Demo() {
  const filters = usePopover();
  const profile = usePopover();
  return (
    <div className="demo-row">
      <Button variant="outlined" startIcon="filter_list" {...filters.getTriggerProps()}>
        Filters
      </Button>
      <IconButton {...profile.getTriggerProps()}>
        <Avatar size="small" color="primary" aria-hidden="true">
          LG
        </Avatar>
        <span className="mtx-visually-hidden">Laura Gomez&apos;s account</span>
      </IconButton>
      <Popover {...filters.popoverProps} className="mtx-p-2">
        <h3 className="mtx-typography--subtitle2 mtx-mb-1">Filter orders</h3>
        <div className="mtx-d-flex mtx-flex-column mtx-gap-1" role="group" aria-label="Order status">
          <Checkbox label="Pending" defaultChecked />
          <Checkbox label="Shipped" />
          <Checkbox label="Returned" />
        </div>
        <div className="mtx-d-flex mtx-justify-content-end mtx-gap-1 mtx-mt-1">
          <Button variant="text" data-mtx-popover-close="">
            Apply
          </Button>
        </div>
      </Popover>
      <Popover {...profile.popoverProps} placement="bottom-end" label="Account">
        <div className="mtx-d-flex mtx-align-items-center mtx-gap-2 mtx-p-2">
          <Avatar color="primary" aria-hidden="true">
            LG
          </Avatar>
          <div>
            <div className="mtx-typography--subtitle2">Laura Gomez</div>
            <div className="mtx-typography--body2 mtx-color-text-secondary">laura@example.com</div>
          </div>
        </div>
        <Divider />
        <div className="mtx-d-flex mtx-justify-content-end mtx-p-1">
          <Button variant="text" startIcon="logout" data-mtx-popover-close="">
            Sign out
          </Button>
        </div>
      </Popover>
    </div>
  );
}
