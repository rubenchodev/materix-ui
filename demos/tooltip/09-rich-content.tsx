import { Tooltip } from '@rubenchodev/materix-react/components/tooltip';
import { Button } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'Rich content', es: 'Contenido enriquecido' };
export const description = {
  en: '`title` accepts any `ReactNode` (formatting, keyboard shortcuts); keep it non-interactive. `describeChild` links it as a description of a trigger that already has a name.',
  es: '`title` admite cualquier `ReactNode` (formato, atajos de teclado); mantenlo no interactivo. `describeChild` lo vincula como descripción de un disparador que ya tiene nombre.',
};

export default function Demo() {
  return (
    <div className="demo-row">
      <Tooltip
        arrow
        placement="right"
        title={
          <>
            <strong>Two-factor authentication</strong>
            <br />
            Asks for a code from your phone each time you sign in on a new device.
          </>
        }
      >
        <Button variant="outlined" startIcon="security">
          2FA
        </Button>
      </Tooltip>
      <Tooltip
        describeChild
        title={
          <>
            Shortcut: <kbd>Ctrl</kbd> + <kbd>S</kbd>
          </>
        }
      >
        <Button variant="contained" startIcon="save">
          Save draft
        </Button>
      </Tooltip>
    </div>
  );
}
