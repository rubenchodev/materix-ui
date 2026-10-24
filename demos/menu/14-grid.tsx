import { Card } from '@rubenchodev/materix-react/components/card';
import { Grid } from '@rubenchodev/materix-react/components/grid';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';
import { Menu, MenuItem, useMenu } from '@rubenchodev/materix-react/components/menu';

export const title = { en: 'In a grid', es: 'En una grilla' };
export const description = {
  en: 'Cards in a `Grid` with their own actions menu; the menu is mounted in a portal, so the card does not clip it.',
  es: 'Tarjetas en un `Grid` con su propio menú de acciones; el menú se monta en un portal y la tarjeta no lo recorta.',
};

/** Tarjeta de informe con menú de acciones. */
function ReportCard({ name }: { name: string }) {
  const menu = useMenu();
  return (
    <>
      <Card
        variant="outlined"
        title={name}
        subheader="Updated today"
        action={<IconButton icon="more_vert" aria-label={`Actions for ${name}`} {...menu.triggerProps} />}
      />
      <Menu {...menu.menuProps}>
        <MenuItem icon="edit">Rename</MenuItem>
        <MenuItem icon="delete">Delete</MenuItem>
      </Menu>
    </>
  );
}

export default function Demo() {
  return (
    <Grid container spacing={2} className="demo-wide">
      {['Q1 report', 'Q2 report', 'Q3 report'].map((name) => (
        <Grid key={name} size={{ xs: 12, sm: 6, md: 4 }}>
          <ReportCard name={name} />
        </Grid>
      ))}
    </Grid>
  );
}
