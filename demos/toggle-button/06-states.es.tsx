import { ToggleButton, ToggleButtonGroup } from '@rubenchodev/materix-react/components/toggle-button';

export const title = { en: 'States', es: 'Estados' };
export const description = {
  en: "Hover, focus ring and ripple come built in. `disabled` dims a single button; on the group it disables them all and sets `aria-disabled`.",
  es: "Hover, anillo de foco y ripple vienen incluidos. `disabled` atenúa un botón; en el grupo los deshabilita todos y marca `aria-disabled`.",
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">Seleccionado · habilitado · deshabilitado</span>
        <ToggleButtonGroup defaultValue={['bold']} aria-label="Estados de formato">
          <ToggleButton value="bold" icon="format_bold" aria-label="Negrita" />
          <ToggleButton value="italic" icon="format_italic" aria-label="Cursiva" />
          <ToggleButton value="underlined" icon="format_underlined" aria-label="Subrayado" disabled />
        </ToggleButtonGroup>
      </div>
      <div className="demo-group">
        <span className="demo-label">Grupo deshabilitado</span>
        <ToggleButtonGroup exclusive disabled defaultValue="day" aria-label="Periodo (deshabilitado)">
          <ToggleButton value="day">Día</ToggleButton>
          <ToggleButton value="week">Semana</ToggleButton>
          <ToggleButton value="month">Mes</ToggleButton>
        </ToggleButtonGroup>
      </div>
    </div>
  );
}
