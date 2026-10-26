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
      write(`${name} cerrado (${reason})`);
      setter(false);
    };

  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Button variant="contained" onClick={() => setShare(true)}>
          Abrir diálogo
        </Button>
      </div>
      <pre className="demo-log" aria-live="polite">
        {log.join('\n')}
      </pre>
      <Dialog
        open={share}
        onClose={closer('Compartir', setShare)}
        maxWidth="sm"
        title="Compartir informe"
        description="Cada Escape cierra solo el diálogo superior; los de abajo siguen abiertos."
        actions={
          <>
            <Button variant="outlined" startIcon="tune" onClick={() => setPermissions(true)}>
              Permisos
            </Button>
            <Button onClick={() => setShare(false)}>Cerrar</Button>
          </>
        }
      >
        <Dialog
          open={permissions}
          onClose={closer('Permisos', setPermissions)}
          maxWidth="xs"
          title="Permisos"
          description="¿Quitar el acceso a todas las personas ajenas al equipo?"
          actions={
            <>
              <Button onClick={() => setPermissions(false)}>Volver</Button>
              <Button variant="contained" color="error" onClick={() => setConfirm(true)}>
                Quitar
              </Button>
            </>
          }
        >
          <Dialog
            open={confirm}
            onClose={closer('Confirmar', setConfirm)}
            role="alertdialog"
            maxWidth="xs"
            title="¿Estás seguro?"
            description="Tercer nivel: Escape cierra este primero."
            actions={
              <Button
                variant="contained"
                onClick={() => {
                  write('Acceso quitado');
                  setConfirm(false);
                  setPermissions(false);
                }}
              >
                Confirmar
              </Button>
            }
          />
        </Dialog>
      </Dialog>
    </div>
  );
}
