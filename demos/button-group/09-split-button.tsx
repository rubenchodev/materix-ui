import { useRef, useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { ButtonGroup } from '@rubenchodev/materix-react/components/button-group';
import { Menu, MenuItem } from '@rubenchodev/materix-react/components/menu';

export const title = { en: 'Split button', es: 'Botón dividido' };
export const description = {
  en: "MUI pattern: the primary action plus an arrow that opens a Menu. The arrow gets `aria-haspopup`, `aria-expanded` and `aria-controls`; choosing an option updates the text of the primary button. The menu anchors to the whole group (as MUI does) while focus still returns to the arrow.",
  es: "Patrón de MUI: la acción principal más una flecha que abre un Menu. La flecha recibe `aria-haspopup`, `aria-expanded` y `aria-controls`; elegir una opción actualiza el texto del botón principal. El menú se ancla a todo el grupo (como en MUI) y el foco vuelve a la flecha.",
};

const OPTIONS = ['Create a merge commit', 'Squash and merge', 'Rebase and merge'];

export default function Demo() {
  const [index, setIndex] = useState(1);
  const [open, setOpen] = useState(false);
  const [focusItem, setFocusItem] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const groupRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLButtonElement>(null);
  const write = (text: string) => setLog((lines) => [text, ...lines].slice(0, 6));

  return (
    <div className="demo-stack">
      <div className="demo-row">
        <ButtonGroup ref={groupRef} variant="contained" label="Merge pull request">
          <Button onClick={() => write(`click → ${OPTIONS[index]}`)}>{OPTIONS[index]}</Button>
          <Button
            ref={arrowRef}
            aria-label="Choose merge strategy"
            aria-haspopup="menu"
            aria-expanded={open}
            aria-controls={open ? 'split-button-menu' : undefined}
            onClick={(event) => {
              // `detail === 0`: abierto con teclado → foco en la opción seleccionada.
              setFocusItem(event.detail === 0);
              setOpen((value) => !value);
            }}
          >
            <span className="material-icons" aria-hidden="true">
              arrow_drop_down
            </span>
          </Button>
        </ButtonGroup>
        <Menu
          id="split-button-menu"
          open={open}
          anchorEl={groupRef}
          restoreFocusTo={arrowRef}
          matchWidth
          autoFocusItem={focusItem}
          onClose={() => setOpen(false)}
          onSelect={({ value }) => {
            const next = OPTIONS.indexOf(value ?? '');
            if (next >= 0) {
              setIndex(next);
              write(`onSelect → "${OPTIONS[next]}"`);
            }
          }}
        >
          {OPTIONS.map((option, i) => (
            <MenuItem key={option} value={option} selected={i === index} disabled={i === 2}>
              {option}
            </MenuItem>
          ))}
        </Menu>
      </div>
      <pre className="demo-log" aria-live="polite">
        {log.join('\n')}
      </pre>
    </div>
  );
}
