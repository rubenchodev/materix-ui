import { Popover, usePopover } from '@rubenchodev/materix-react/components/popover';
import { Grid } from '@rubenchodev/materix-react/components/grid';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';
import { Paper } from '@rubenchodev/materix-react/components/paper';

export const title = { en: 'Grid layout', es: 'Maquetación en grilla' };
export const description = {
  en: 'The popover is portaled to `<body>`, so columns and containers with `overflow` never clip it. Several triggers share one popover.',
  es: 'El popover se porta a `<body>`, así que las columnas y los contenedores con `overflow` nunca lo recortan. Varios disparadores comparten un popover.',
};

const ITEMS = [
  { key: 'storage', text: 'Storage: 72%', label: 'Storage details' },
  { key: 'users', text: 'Active users: 18', label: 'User details' },
];

export default function Demo() {
  const popover = usePopover();
  return (
    <>
      <Grid container spacing={2}>
        {ITEMS.map((item) => (
          <Grid key={item.key} size={{ xs: 12, sm: 6 }}>
            <Paper
              variant="outlined"
              className="mtx-p-2 mtx-d-flex mtx-align-items-center mtx-justify-content-between"
            >
              <span>{item.text}</span>
              <IconButton
                icon="more_horiz"
                size="small"
                aria-label={item.label}
                {...popover.getTriggerProps({ key: item.key })}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Popover {...popover.popoverProps} placement="bottom-end" label="Details" className="mtx-p-2 demo-fixed-width">
        Data updated 5 minutes ago.
      </Popover>
    </>
  );
}
