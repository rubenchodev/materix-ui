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
        <span className="demo-label">Text</span>
        <ToggleButtonGroup exclusive defaultValue="web" aria-label="Platform">
          <ToggleButton value="web">Web</ToggleButton>
          <ToggleButton value="android">Android</ToggleButton>
          <ToggleButton value="ios">iOS</ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div className="demo-group">
        <span className="demo-label">Icon and text</span>
        <ToggleButtonGroup exclusive defaultValue="month" aria-label="Period">
          <ToggleButton value="day" icon="today">Day</ToggleButton>
          <ToggleButton value="week" icon="view_week">Week</ToggleButton>
          <ToggleButton value="month" icon="calendar_month">Month</ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div className="demo-group">
        <span className="demo-label">Icon only</span>
        <ToggleButtonGroup exclusive defaultValue="phone" aria-label="Device">
          <ToggleButton value="laptop" icon="laptop" aria-label="Laptop" />
          <ToggleButton value="tv" icon="tv" aria-label="TV" />
          <ToggleButton value="phone" icon="phone_android" aria-label="Phone" />
        </ToggleButtonGroup>
      </div>
    </div>
  );
}
