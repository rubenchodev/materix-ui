import { Button } from '@rubenchodev/materix-react/components/button';
import { ButtonGroup } from '@rubenchodev/materix-react/components/button-group';

export const title = { en: 'With icons', es: 'Con iconos' };
export const description = {
  en: "Each child accepts the Button props (`startIcon`, `endIcon`). For icon-only buttons, use a direct `.material-icons` and an `aria-label`: the group compacts their padding.",
  es: "Cada hijo acepta las props de Button (`startIcon`, `endIcon`). Para botones de solo icono, usa un `.material-icons` directo y un `aria-label`: el grupo compacta su relleno.",
};

const ALIGN = [
  { icon: 'format_align_left', label: 'Align left' },
  { icon: 'format_align_center', label: 'Center' },
  { icon: 'format_align_right', label: 'Align right' },
  { icon: 'format_align_justify', label: 'Justify' },
];

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">No icon</span>
        <ButtonGroup label="No icon">
          <Button>Day</Button>
          <Button>Week</Button>
          <Button>Month</Button>
        </ButtonGroup>
      </div>
      <div className="demo-group">
        <span className="demo-label">Start icon</span>
        <ButtonGroup variant="contained" label="Start icon">
          <Button startIcon="content_copy">Copy</Button>
          <Button startIcon="content_cut">Cut</Button>
          <Button startIcon="content_paste">Paste</Button>
        </ButtonGroup>
      </div>
      <div className="demo-group">
        <span className="demo-label">End icon</span>
        <ButtonGroup label="End icon">
          <Button endIcon="send">Send</Button>
          <Button endIcon="schedule_send">Schedule</Button>
        </ButtonGroup>
      </div>
      <div className="demo-group">
        <span className="demo-label">Icon only</span>
        <ButtonGroup label="Text alignment">
          {ALIGN.map(({ icon, label }) => (
            <Button key={icon} aria-label={label}>
              <span className="material-icons" aria-hidden="true">
                {icon}
              </span>
            </Button>
          ))}
        </ButtonGroup>
      </div>
    </div>
  );
}
