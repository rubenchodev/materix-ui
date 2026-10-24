import { Tooltip } from '@rubenchodev/materix-react/components/tooltip';
import { Paper } from '@rubenchodev/materix-react/components/paper';
import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'Follow cursor', es: 'Seguir el cursor' };
export const description = {
  en: '`followCursor` anchors the tooltip to the pointer while it moves over the trigger; the tooltip does not retain the pointer.',
  es: '`followCursor` ancla el tooltip al puntero mientras se mueve sobre el disparador; el tooltip no retiene el puntero.',
};

export default function Demo() {
  return (
    <Tooltip title="I follow the cursor" followCursor>
      <Paper variant="outlined" className="demo-wide mtx-p-4">
        <Typography variant="body2" color="text-secondary">
          Move the cursor around this area.
        </Typography>
      </Paper>
    </Tooltip>
  );
}
