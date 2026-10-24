import { Tooltip } from '@rubenchodev/materix-react/components/tooltip';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';

export const title = { en: 'Arrow', es: 'Flecha' };
export const description = {
  en: '`arrow` adds an arrow that points at the center of the trigger, even when the tooltip shifts to fit.',
  es: '`arrow` añade una flecha que apunta al centro del disparador, incluso cuando el tooltip se desplaza para caber.',
};

export default function Demo() {
  return (
    <div className="demo-row">
      <Tooltip title="Add" arrow>
        <IconButton icon="add" />
      </Tooltip>
      <Tooltip title="Edit" arrow placement="top">
        <IconButton icon="edit" />
      </Tooltip>
      <Tooltip title="Back" arrow placement="left">
        <IconButton icon="arrow_back" />
      </Tooltip>
      <Tooltip title="Next" arrow placement="right">
        <IconButton icon="arrow_forward" />
      </Tooltip>
    </div>
  );
}
