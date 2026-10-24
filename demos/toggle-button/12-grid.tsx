import { ToggleButton, ToggleButtonGroup } from '@rubenchodev/materix-react/components/toggle-button';

export const title = { en: 'Grid layout', es: 'Maquetación en grilla' };
export const description = {
  en: "With `fullWidth` each group takes the width of its grid column.",
  es: "Con `fullWidth` cada grupo toma el ancho de su columna de la grilla.",
};

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <ToggleButtonGroup exclusive fullWidth defaultValue="list" aria-label="View">
        <ToggleButton value="list" icon="view_list">List</ToggleButton>
        <ToggleButton value="grid" icon="grid_view">Grid</ToggleButton>
      </ToggleButtonGroup>
      <ToggleButtonGroup exclusive fullWidth color="primary" defaultValue="week" aria-label="Range">
        <ToggleButton value="day">Day</ToggleButton>
        <ToggleButton value="week">Week</ToggleButton>
        <ToggleButton value="month">Month</ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}
