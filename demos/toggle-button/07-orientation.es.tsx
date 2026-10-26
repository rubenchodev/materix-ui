import { ToggleButton, ToggleButtonGroup } from '@rubenchodev/materix-react/components/toggle-button';

export const title = { en: 'Vertical orientation', es: 'Orientación vertical' };
export const description = {
  en: "`orientation=\"vertical\"` stacks the buttons; the up and down arrows move focus.",
  es: "`orientation=\"vertical\"` apila los botones; las flechas arriba y abajo mueven el foco.",
};

export default function Demo() {
  return (
    <div className="demo-row">
      <ToggleButtonGroup exclusive orientation="vertical" defaultValue="list" aria-label="Vista">
        <ToggleButton value="list" icon="view_list" aria-label="Lista" />
        <ToggleButton value="module" icon="view_module" aria-label="Módulos" />
        <ToggleButton value="quilt" icon="view_quilt" aria-label="Mosaico" />
      </ToggleButtonGroup>
      <ToggleButtonGroup exclusive orientation="vertical" color="primary" defaultValue="day" aria-label="Periodo">
        <ToggleButton value="day" icon="today">Día</ToggleButton>
        <ToggleButton value="week" icon="view_week">Semana</ToggleButton>
        <ToggleButton value="month" icon="calendar_month">Mes</ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}
