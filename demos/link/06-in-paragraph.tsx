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
      <span className="demo-label">body2 paragraph</span>
      <Typography variant="body2" className="demo-wide">
        By creating an account you accept the <Link href="#in-paragraph">terms of service</Link> and the{' '}
        <Link href="#in-paragraph">privacy policy</Link>. You can change your preferences at any time from the settings panel.
      </Typography>
    </div>
  );
}
