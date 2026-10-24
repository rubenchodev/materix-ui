import { useEffect, useRef, useState } from 'react';
import { Button, type ButtonOwnProps } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'Loading', es: 'Carga' };
export const description = {
  en: "With `loading` the button is disabled, gets `aria-busy=\"true\"` and shows a decorative CircularProgress, like MUI's `loading`. `loadingPosition` chooses where: `center` (hides the text and keeps the width), `start` or `end` (replace the start or end icon). `loadingIndicator` shows a text instead of the spinner. Click any interactive button to see it load for 2 seconds.",
  es: "Con `loading` el botón se deshabilita, recibe `aria-busy=\"true\"` y muestra un CircularProgress decorativo, como el `loading` de MUI. `loadingPosition` elige dónde: `center` (oculta el texto y mantiene el ancho), `start` o `end` (sustituyen el icono inicial o final). `loadingIndicator` muestra un texto en lugar del spinner. Haz clic en un botón interactivo para verlo cargar 2 segundos.",
};

interface LoadingOnClickProps extends ButtonOwnProps {
  onStatus: (text: string) => void;
}

/** Botón que entra en carga 2 s al hacer clic. */
function LoadingOnClick({ onStatus, ...props }: LoadingOnClickProps) {
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const handleClick = () => {
    setLoading(true);
    onStatus('Saving…');
    timer.current = setTimeout(() => {
      setLoading(false);
      onStatus('Changes saved');
    }, 2000);
  };
  return <Button {...props} loading={loading} onClick={handleClick} />;
}

export default function Demo() {
  const [status, setStatus] = useState('');
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">Static · loading</span>
        <div className="demo-row">
          <Button variant="contained" loading>Save</Button>
          <Button variant="outlined" loading loadingPosition="start" startIcon="save">Save</Button>
          <Button loading loadingPosition="end" endIcon="send">Send</Button>
          <Button variant="outlined" loading loadingIndicator="Loading…">Download</Button>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Interactive · click → 2 s loading</span>
        <div className="demo-row">
          <LoadingOnClick variant="contained" onStatus={setStatus}>Save</LoadingOnClick>
          <LoadingOnClick variant="contained" loadingPosition="start" startIcon="save" onStatus={setStatus}>
            Save
          </LoadingOnClick>
          <LoadingOnClick variant="outlined" loadingPosition="end" endIcon="send" onStatus={setStatus}>
            Send
          </LoadingOnClick>
          <LoadingOnClick variant="outlined" loadingIndicator="Paying…" onStatus={setStatus}>
            Pay $49
          </LoadingOnClick>
          <LoadingOnClick variant="contained" size="small" onStatus={setStatus}>Small</LoadingOnClick>
          <LoadingOnClick variant="contained" size="large" onStatus={setStatus}>Large</LoadingOnClick>
        </div>
        <p className="demo-status" role="status" aria-live="polite">
          {status}
        </p>
      </div>
    </div>
  );
}
