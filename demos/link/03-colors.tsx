import { Alert } from '@rubenchodev/materix-react/components/alert';
import { Link, type LinkColor } from '@rubenchodev/materix-react/components/link';

export const title = { en: 'Colors', es: 'Colores' };
export const description = {
  en: '`color` accepts the six palette colors, the text colors and `inherit`.',
  es: '`color` acepta los seis colores de la paleta, los de texto e `inherit`.',
};

const palette: LinkColor[] = ['primary', 'secondary', 'error', 'warning', 'info', 'success'];

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">Palette</span>
        <div className="demo-row">
          {palette.map((color) => (
            <Link key={color} href="#colors" color={color === 'primary' ? undefined : color}>
              {color}
            </Link>
          ))}
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Text</span>
        <div className="demo-row">
          <Link href="#colors" color="text-primary">
            text-primary
          </Link>
          <Link href="#colors" color="text-secondary">
            text-secondary
          </Link>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">inherit · inside an alert</span>
        <Alert severity="info">
          A new version is available.{' '}
          <Link href="#colors" color="inherit" underline="always">
            See what&apos;s new
          </Link>
        </Alert>
      </div>
    </div>
  );
}
