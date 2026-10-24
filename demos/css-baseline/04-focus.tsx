import { Button } from '@rubenchodev/materix-react/components/button';
import { ScopedCssBaseline } from '@rubenchodev/materix-react/components/css-baseline';
import { Link } from '@rubenchodev/materix-react/components/link';
import { TextField } from '@rubenchodev/materix-react/components/text-field';

export const title = { en: 'Visible focus', es: 'Foco visible' };

export const description = {
  en: 'Use Tab: buttons, links and focusable elements show the `--mtx-focus-ring-color` ring only when navigating with the keyboard. Text fields are excluded because their border already shows focus.',
  es: 'Usa Tab: botones, enlaces y elementos enfocables muestran el anillo `--mtx-focus-ring-color` solo al navegar con el teclado. Los campos de texto se excluyen porque su borde ya indica el foco.',
};

export default function Demo() {
  return (
    <ScopedCssBaseline className="demo-row">
      <Button variant="outlined">Button</Button>
      <Link href="#focus">Link</Link>
      <TextField label="Field" variant="outlined" size="small" type="text" />
    </ScopedCssBaseline>
  );
}
