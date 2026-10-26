import { ToggleButton, ToggleButtonGroup } from '@rubenchodev/materix-react/components/toggle-button';

export const title = { en: 'With and without icons', es: 'Con y sin iconos' };
export const description = {
  en: "Text only, icon and text (`icon` goes before the text) or icon only with `aria-label`.",
  es: "Solo texto, icono y texto (`icon` va antes del texto) o solo icono con `aria-label`.",
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">Texto</span>
        <ToggleButtonGroup exclusive defaultValue="web" aria-label="Plataforma">
          <ToggleButton value="web">Web</ToggleButton>
          <ToggleButton value="android">Android</ToggleButton>
          <ToggleButton value="ios">iOS</ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div className="demo-group">
        <span className="demo-label">Icono y texto</span>
        <ToggleButtonGroup exclusive defaultValue="month" aria-label="Periodo">
          <ToggleButton value="day" icon="today">Día</ToggleButton>
          <ToggleButton value="week" icon="view_week">Semana</ToggleButton>
          <ToggleButton value="month" icon="calendar_month">Mes</ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div className="demo-group">
        <span className="demo-label">Solo icono</span>
        <ToggleButtonGroup exclusive defaultValue="phone" aria-label="Dispositivo">
          <ToggleButton value="laptop" icon="laptop" aria-label="Portátil" />
          <ToggleButton value="tv" icon="tv" aria-label="Televisor" />
          <ToggleButton value="phone" icon="phone_android" aria-label="Teléfono" />
        </ToggleButtonGroup>
      </div>
    </div>
  );
}
