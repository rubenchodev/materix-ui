import { Card, CardContent } from '@rubenchodev/materix-react/components/card';

export const title = { en: 'Elevation in the dark theme', es: 'Elevación en el tema oscuro' };
export const description = {
  en: 'In dark mode, as in MUI, each elevation adds a white overlay (`--mtx-overlay-elevation-N`): elevation 8 looks lighter than elevation 1, and `outlined` has no overlay.',
  es: 'En modo oscuro, como en MUI, cada elevación suma una capa blanca (`--mtx-overlay-elevation-N`): la elevación 8 se ve más clara que la 1, y `outlined` no lleva capa.',
};

export default function Demo() {
  return (
    <div className="demo-surface" data-mtx-theme="dark">
      <Card elevation={0} title="Elevation 0" subheader="elevation={0}" className="demo-fixed-width">
        <CardContent>No shadow, no overlay.</CardContent>
      </Card>
      <Card title="Elevation 1" subheader="Default" className="demo-fixed-width">
        <CardContent>5% white overlay.</CardContent>
      </Card>
      <Card elevation={8} title="Elevation 8" subheader="elevation={8}" className="demo-fixed-width">
        <CardContent>12% white overlay.</CardContent>
      </Card>
      <Card variant="outlined" title="Outlined" subheader="No overlay" className="demo-fixed-width">
        <CardContent>Border only.</CardContent>
      </Card>
    </div>
  );
}
