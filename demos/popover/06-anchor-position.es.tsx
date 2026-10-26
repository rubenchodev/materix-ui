import { useState } from 'react';
import { Popover } from '@rubenchodev/materix-react/components/popover';

export const title = { en: 'Position by coordinates', es: 'Posición por coordenadas' };
export const description = {
  en: '`anchorReference="anchorPosition"` with `anchorPosition={{ top, left }}` anchors the popover to a viewport point (MUI’s `anchorPosition`). Right-click inside the area.',
  es: '`anchorReference="anchorPosition"` con `anchorPosition={{ top, left }}` ancla el popover a un punto del viewport (el `anchorPosition` de MUI). Haz clic derecho dentro del área.',
};

export default function Demo() {
  const [point, setPoint] = useState<{ top: number; left: number } | null>(null);
  return (
    <>
      <div
        className="demo-panel"
        tabIndex={0}
        aria-label="Área con menú contextual"
        onContextMenu={(event) => {
          event.preventDefault();
          setPoint({ top: event.clientY, left: event.clientX });
        }}
      >
        <p>Haz clic derecho aquí para abrir un popover en el cursor.</p>
      </div>
      <Popover
        open={point !== null}
        anchorReference="anchorPosition"
        anchorPosition={point ?? undefined}
        onClose={() => setPoint(null)}
        label="Detalles del punto"
        className="mtx-p-2"
      >
        {point && `x: ${point.left} · y: ${point.top}`}
      </Popover>
    </>
  );
}
