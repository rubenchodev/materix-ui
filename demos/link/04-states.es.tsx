import { useState } from 'react';
import { Checkbox } from '@rubenchodev/materix-react/components/checkbox';
import { Link } from '@rubenchodev/materix-react/components/link';

export const title = { en: 'States', es: 'Estados' };
export const description = {
  en: 'Hover to see the underline and use Tab to see the focus ring. `disabled` disables the link (`aria-disabled`, out of the tab order and not clickable on `<a>`; `disabled` on `<button>`).',
  es: 'Pasa el ratón para ver el subrayado y usa Tab para ver el anillo de foco. `disabled` deshabilita el enlace (`aria-disabled`, fuera del orden de tabulación y sin clic en `<a>`; `disabled` en `<button>`).',
};

export default function Demo() {
  const [disabled, setDisabled] = useState(true);
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">Normal · hover · focus-visible</span>
        <div className="demo-row">
          <Link href="#states">Enlace normal</Link>
          <Link href="#states" underline="hover">
            Subrayado al pasar el ratón
          </Link>
          <Link href="#states" color="text-secondary">
            Enlace secundario
          </Link>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Deshabilitado · disabled</span>
        <div className="demo-row">
          <Link href="#states" disabled={disabled}>
            Enlace deshabilitado
          </Link>
          <Link component="button" disabled={disabled}>
            Botón enlace deshabilitado
          </Link>
          <Checkbox label="disabled" checked={disabled} onChange={(_, checked) => setDisabled(checked)} />
        </div>
      </div>
    </div>
  );
}
