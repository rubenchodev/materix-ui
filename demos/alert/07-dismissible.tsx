import { useState } from 'react';
import { Alert } from '@rubenchodev/materix-react/components/alert';
import { Button } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'Dismissible', es: 'Descartables' };
export const description = {
  en: '`onClose` adds an accessible close button; the alert fades out and receives `hidden`. `closeLabel` changes its name.',
  es: '`onClose` añade un botón de cierre accesible; la alerta se desvanece y recibe `hidden`. `closeLabel` cambia su nombre.',
};

export default function Demo() {
  const [notice, setNotice] = useState(true);
  const [critical, setCritical] = useState(true);
  return (
    <div className="demo-stack demo-wide">
      <Alert severity="info" open={notice} onClose={() => setNotice(false)} closeLabel="Dismiss notice">
        You can dismiss this notice.
      </Alert>
      <Alert severity="error" variant="filled" title="Critical error" open={critical} onClose={() => setCritical(false)}>
        Synchronization has stopped.
      </Alert>
      <div className="demo-row">
        <Button
          variant="outlined"
          onClick={() => {
            setNotice(true);
            setCritical(true);
          }}
        >
          Restore closed alerts
        </Button>
      </div>
    </div>
  );
}
