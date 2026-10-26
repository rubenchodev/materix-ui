import { Chip, type ChipColor } from '@rubenchodev/materix-react/components/chip';

export const title = { en: 'Colors', es: 'Colores' };
export const description = {
  en: '`color` accepts the whole palette; on `outlined` it applies to the text and the border.',
  es: '`color` acepta toda la paleta; en `outlined` se aplica al texto y al borde.',
};

const COLORS: ChipColor[] = ['default', 'primary', 'secondary', 'error', 'warning', 'info', 'success'];
const COLOR_LABELS: Record<ChipColor, string> = {
  default: 'Por defecto',
  primary: 'Primario',
  secondary: 'Secundario',
  error: 'Error',
  warning: 'Advertencia',
  info: 'Información',
  success: 'Éxito',
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">Filled</span>
        <div className="demo-row">
          {COLORS.map((color) => (
            <Chip key={color} label={COLOR_LABELS[color]} color={color} />
          ))}
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Outlined</span>
        <div className="demo-row">
          {COLORS.map((color) => (
            <Chip key={color} label={COLOR_LABELS[color]} color={color} variant="outlined" />
          ))}
        </div>
      </div>
    </div>
  );
}
