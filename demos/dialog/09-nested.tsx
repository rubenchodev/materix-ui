import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Dialog } from '@rubenchodev/materix-react/components/dialog';
import type { DialogCloseReason } from '@rubenchodev/materix-react/components/dialog';

export const title = { en: 'Nested dialogs and Escape', es: 'Diálogos anidados y Escape' };
export const description = {
  en: 'A dialog opened from another one is stacked above it, focus is trapped only in the top one and each `Escape` closes only the top dialog. The log shows the order and the `reason` of each close.',
  es: 'Un diálogo abierto desde otro se apila encima, el foco queda atrapado solo en el superior y cada `Escape` cierra únicamente el diálogo de arriba. El registro muestra el orden y el `reason` de cada cierre.',
};

export default function Demo() {
  const [share, setShare] = useState(false);
  const [permissions, setPermissions] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const write = (text: string) => setLog((lines) => [...lines.slice(-5), text]);
  const closer =
    (name: string, setter: (value: boolean) => void) =>
    (_event: unknown, reason: DialogCloseReason) => {
      write(`${name} closed (${reason})`);
      setter(false);
    };

  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Button variant="contained" onClick={() => setShare(true)}>
          Open dialog
        </Button>
      </div>
      <pre className="demo-log" aria-live="polite">
        {log.join('\n')}
      </pre>
      <Dialog
        open={share}
        onClose={closer('Share', setShare)}
        maxWidth="sm"
        title="Share report"
        description="Each Escape closes only the top dialog; the ones below stay open."
        actions={
          <>
            <Button variant="outlined" startIcon="tune" onClick={() => setPermissions(true)}>
              Permissions
            </Button>
            <Button onClick={() => setShare(false)}>Close</Button>
          </>
        }
      >
        <Dialog
          open={permissions}
          onClose={closer('Permissions', setPermissions)}
          maxWidth="xs"
          title="Permissions"
          description="Remove access for everyone outside the team?"
          actions={
            <>
              <Button onClick={() => setPermissions(false)}>Back</Button>
              <Button variant="contained" color="error" onClick={() => setConfirm(true)}>
                Remove
              </Button>
            </>
          }
        >
          <Dialog
            open={confirm}
            onClose={closer('Confirm', setConfirm)}
            role="alertdialog"
            maxWidth="xs"
            title="Are you sure?"
            description="Third level: Escape closes this one first."
            actions={
              <Button
                variant="contained"
                onClick={() => {
                  write('Access removed');
                  setConfirm(false);
                  setPermissions(false);
                }}
              >
                Confirm
              </Button>
            }
          />
        </Dialog>
      </Dialog>
    </div>
  );
}
