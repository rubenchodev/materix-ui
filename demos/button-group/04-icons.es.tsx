import { Button } from '@rubenchodev/materix-react/components/button';
import { ButtonGroup } from '@rubenchodev/materix-react/components/button-group';

export const title = { en: 'With icons', es: 'Con iconos' };
export const description = {
  en: "Each child accepts the Button props (`startIcon`, `endIcon`). For icon-only buttons, use a direct `.material-icons` and an `aria-label`: the group compacts their padding.",
  es: "Cada hijo acepta las props de Button (`startIcon`, `endIcon`). Para botones de solo icono, usa un `.material-icons` directo y un `aria-label`: el grupo compacta su relleno.",
};

const ALIGN = [
  { icon: 'format_align_left', label: 'Alinear a la izquierda' },
  { icon: 'format_align_center', label: 'Centrar' },
  { icon: 'format_align_right', label: 'Alinear a la derecha' },
  { icon: 'format_align_justify', label: 'Justificar' },
];

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">Sin icono</span>
        <ButtonGroup label="Sin icono">
          <Button>Día</Button>
          <Button>Semana</Button>
          <Button>Mes</Button>
        </ButtonGroup>
      </div>
      <div className="demo-group">
        <span className="demo-label">Icono al inicio</span>
        <ButtonGroup variant="contained" label="Icono al inicio">
          <Button startIcon="content_copy">Copiar</Button>
          <Button startIcon="content_cut">Cortar</Button>
          <Button startIcon="content_paste">Pegar</Button>
        </ButtonGroup>
      </div>
      <div className="demo-group">
        <span className="demo-label">Icono al final</span>
        <ButtonGroup label="Icono al final">
          <Button endIcon="send">Enviar</Button>
          <Button endIcon="schedule_send">Programar</Button>
        </ButtonGroup>
      </div>
      <div className="demo-group">
        <span className="demo-label">Solo icono</span>
        <ButtonGroup label="Alineación del texto">
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
