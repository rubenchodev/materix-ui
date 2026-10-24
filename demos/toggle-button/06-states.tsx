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
        <span className="demo-label">Selected · enabled · disabled</span>
        <ToggleButtonGroup defaultValue={['bold']} aria-label="Formatting states">
          <ToggleButton value="bold" icon="format_bold" aria-label="Bold" />
          <ToggleButton value="italic" icon="format_italic" aria-label="Italic" />
          <ToggleButton value="underlined" icon="format_underlined" aria-label="Underline" disabled />
        </ToggleButtonGroup>
      </div>
      <div className="demo-group">
        <span className="demo-label">Disabled group</span>
        <ToggleButtonGroup exclusive disabled defaultValue="day" aria-label="Period (disabled)">
          <ToggleButton value="day">Day</ToggleButton>
          <ToggleButton value="week">Week</ToggleButton>
          <ToggleButton value="month">Month</ToggleButton>
        </ToggleButtonGroup>
      </div>
    </div>
  );
}
