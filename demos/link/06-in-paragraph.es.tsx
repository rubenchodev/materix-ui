import { Link } from '@rubenchodev/materix-react/components/link';
import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'In a paragraph', es: 'Dentro de un párrafo' };
export const description = {
  en: 'Inside running text keep the default underline (`always`) so the link doesn\'t rely on color alone (WCAG 1.4.1). The link inherits the paragraph\'s typography, so it fits any variant.',
  es: 'Dentro de texto corrido mantén el subrayado por defecto (`always`) para que el enlace no dependa solo del color (WCAG 1.4.1). El enlace hereda la tipografía del párrafo, así que encaja en cualquier variante.',
};

export default function Demo() {
  return (
    <div className="demo-group">
      <span className="demo-label">Párrafo body2</span>
      <Typography variant="body2" className="demo-wide">
        Al crear una cuenta aceptas los <Link href="#in-paragraph">términos del servicio</Link> y la{' '}
        <Link href="#in-paragraph">política de privacidad</Link>. Puedes cambiar tus preferencias en cualquier momento desde el panel de ajustes.
      </Typography>
    </div>
  );
}
