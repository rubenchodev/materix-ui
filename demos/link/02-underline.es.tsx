import { Link } from '@rubenchodev/materix-react/components/link';

export const title = { en: 'Underline', es: 'Subrayado' };
export const description = {
  en: 'The link\'s variant is its underline: `underline="always|hover|none"`. `always` is the default, as in MUI v5: a soft underline (40% of the color) that becomes solid on hover. Use `hover` or `none` only for links that are not inside running text (navigation, lists, footers).',
  es: 'La variante del enlace es su subrayado: `underline="always|hover|none"`. `always` es el valor por defecto, como en MUI v5: un subrayado suave (40 % del color) que se vuelve sólido al pasar el ratón. Usa `hover` o `none` solo en enlaces que no estén dentro de texto corrido (navegación, listas, pies de página).',
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">always · por defecto</span>
        <div className="demo-row">
          <Link href="#underline">Siempre subrayado</Link>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">hover</span>
        <div className="demo-row">
          <Link href="#underline" underline="hover">
            Subrayado al pasar el ratón
          </Link>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">none</span>
        <div className="demo-row">
          <Link href="#underline" underline="none">
            Nunca subrayado
          </Link>
        </div>
      </div>
    </div>
  );
}
