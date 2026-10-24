import { Radio, RadioGroup } from '@rubenchodev/materix-react/components/radio';

export const title = { en: 'States', es: 'Estados' };
export const description = {
  en: "Hover to see the colored border, press to see the ripple, and use Tab to enter the group and the arrow keys to change the option. The native radio does not support readOnly: use disabled to lock it.",
  es: "Pasa el ratón para ver el borde de color, pulsa para ver el ripple y usa Tab para entrar en el grupo y las flechas para cambiar de opción. El radio nativo no admite readOnly: usa disabled para bloquearlo.",
};

export default function Demo() {
  return (
    <div className="demo-grid-3">
      <div className="demo-group">
        <span className="demo-label">Enabled</span>
        <RadioGroup aria-label="Enabled" defaultValue="on">
          <Radio value="on" label="Selected" />
          <Radio value="off" label="Unselected" />
        </RadioGroup>
      </div>
      <div className="demo-group">
        <span className="demo-label">Disabled · disabled</span>
        <RadioGroup aria-label="Disabled" defaultValue="on" disabled>
          <Radio value="on" label="Selected" />
          <Radio value="off" label="Unselected" />
        </RadioGroup>
      </div>
      <div className="demo-group">
        <span className="demo-label">Error · error</span>
        <RadioGroup label="How did you hear about us?" error helperText="Select an option.">
          <Radio value="search" label="Search engine" required />
          <Radio value="friend" label="Recommendation" required />
        </RadioGroup>
      </div>
    </div>
  );
}
