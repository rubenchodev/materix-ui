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
          <span className="demo-label">Sin icono</span>
          <Select label="Destino" options={CITIES} />
        </div>
        <div className="demo-group">
          <span className="demo-label">Icono inicial</span>
          <Select label="Destino" startIcon="place" options={CITIES} />
        </div>
        <div className="demo-group">
          <span className="demo-label">Iconos en opciones</span>
          <Select label="Método de pago">
            <option value="card" data-icon="credit_card">Tarjeta</option>
            <option value="cash" data-icon="payments">Efectivo</option>
            <option value="bank" data-icon="account_balance">Transferencia</option>
          </Select>
        </div>
        <div className="demo-group">
          <span className="demo-label">Imágenes en opciones</span>
          <Select
            label="País"
            options={[
              { value: 'co', label: 'Colombia', image: 'https://flagcdn.com/w40/co.png' },
              { value: 'mx', label: 'México', image: 'https://flagcdn.com/w40/mx.png' },
              { value: 'es', label: 'España', image: 'https://flagcdn.com/w40/es.png' },
            ]}
          />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Iconos en filled y standard · texto secundario</span>
        <div className="demo-grid-3">
          <Select label="Idioma" variant="filled" startIcon="language" options={[{ value: 'es', label: 'Español' }, { value: 'en', label: 'Inglés' }]} />
          <Select label="Usuario" variant="standard" startIcon="person" options={[{ value: 'ana', label: 'Ana' }, { value: 'luis', label: 'Luis' }]} />
          <Select
            label="Notificar por"
            variant="filled"
            options={[
              { value: 'mail', label: 'Correo', icon: 'email', secondary: 'Resumen diario' },
              { value: 'sms', label: 'SMS', icon: 'sms', secondary: 'Solo alertas urgentes' },
              { value: 'push', label: 'Push', icon: 'notifications', secondary: 'Tiempo real' },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
