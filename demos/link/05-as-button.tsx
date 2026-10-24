import { useState } from 'react';
import { Link } from '@rubenchodev/materix-react/components/link';
import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'As a button', es: 'Como botón' };
export const description = {
  en: 'For actions that don\'t navigate but should look like a link inside text, use `component="button"`: no native background, border or padding, and the typography of the surrounding text. Without `type`, it gets `type="button"` so it doesn\'t submit forms.',
  es: 'Para acciones que no navegan pero deben verse como enlace dentro de un texto, usa `component="button"`: sin fondo, borde ni relleno nativos y con la tipografía del texto que lo rodea. Sin `type`, recibe `type="button"` para no enviar formularios.',
};

export default function Demo() {
  const [sent, setSent] = useState(0);
  return (
    <div className="demo-group">
      <span className="demo-label">Inside a body2 and a body1 paragraph</span>
      <Typography variant="body2">
        Didn&apos;t get the code?{' '}
        <Link component="button" onClick={() => setSent((n) => n + 1)}>
          Resend code
        </Link>
        {sent > 0 ? <span role="status"> · Sent {sent}×</span> : null}
      </Typography>
      <Typography variant="body1">
        Forgot your password?{' '}
        <Link component="button" underline="always">
          Recover it here
        </Link>
      </Typography>
    </div>
  );
}
