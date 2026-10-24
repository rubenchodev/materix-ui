import { Link } from '@rubenchodev/materix-react/components/link';

export const title = { en: 'External links', es: 'Enlaces externos' };
export const description = {
  en: 'With `target="_blank"` always add `rel="noopener noreferrer"` and announce the change of context in the visible text or in text hidden for screen readers.',
  es: 'Con `target="_blank"` añade siempre `rel="noopener noreferrer"` y anuncia el cambio de contexto en el texto visible o en un texto oculto para lectores de pantalla.',
};

export default function Demo() {
  return (
    <div className="demo-row">
      <Link href="https://mui.com/material-ui/react-link/" target="_blank" rel="noopener noreferrer">
        MUI guide (opens in a new tab)
      </Link>
      <Link href="https://github.com/" target="_blank" rel="noopener noreferrer">
        GitHub repository<span className="demo-visually-hidden"> (opens in a new tab)</span>
      </Link>
    </div>
  );
}
