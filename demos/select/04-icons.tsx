import { Select } from '@rubenchodev/materix-react/components/select';

export const title = { en: 'With and without icons', es: 'Con y sin iconos' };
export const description = {
  en: "`startIcon` on the control (icon name or URL) and `icon` / `image` on each option (or `data-icon` / `data-image` on `<option>`). The icon of the chosen option also appears in the control; `secondary` adds a second line in the menu.",
  es: "`startIcon` en el control (nombre de icono o URL) e `icon` / `image` en cada opción (o `data-icon` / `data-image` en `<option>`). El icono de la opción elegida aparece también en el control; `secondary` añade una segunda línea en el menú.",
};

const CITIES = [
  { value: 'bog', label: 'Bogotá' },
  { value: 'med', label: 'Medellín' },
];

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-grid-4">
        <div className="demo-group">
          <span className="demo-label">No icon</span>
          <Select label="Destination" options={CITIES} />
        </div>
        <div className="demo-group">
          <span className="demo-label">Start icon</span>
          <Select label="Destination" startIcon="place" options={CITIES} />
        </div>
        <div className="demo-group">
          <span className="demo-label">Icons in options</span>
          <Select label="Payment">
            <option value="card" data-icon="credit_card">Card</option>
            <option value="cash" data-icon="payments">Cash</option>
            <option value="bank" data-icon="account_balance">Bank transfer</option>
          </Select>
        </div>
        <div className="demo-group">
          <span className="demo-label">Images in options</span>
          <Select
            label="Country"
            options={[
              { value: 'co', label: 'Colombia', image: 'https://flagcdn.com/w40/co.png' },
              { value: 'mx', label: 'Mexico', image: 'https://flagcdn.com/w40/mx.png' },
              { value: 'es', label: 'Spain', image: 'https://flagcdn.com/w40/es.png' },
            ]}
          />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Icons in filled and standard · secondary text</span>
        <div className="demo-grid-3">
          <Select label="Language" variant="filled" startIcon="language" options={[{ value: 'es', label: 'Spanish' }, { value: 'en', label: 'English' }]} />
          <Select label="User" variant="standard" startIcon="person" options={[{ value: 'ana', label: 'Ana' }, { value: 'luis', label: 'Luis' }]} />
          <Select
            label="Notify by"
            variant="filled"
            options={[
              { value: 'mail', label: 'Email', icon: 'email', secondary: 'Daily digest' },
              { value: 'sms', label: 'SMS', icon: 'sms', secondary: 'Only urgent alerts' },
              { value: 'push', label: 'Push', icon: 'notifications', secondary: 'Real time' },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
