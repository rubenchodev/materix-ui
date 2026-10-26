import { Card, CardContent } from '@rubenchodev/materix-react/components/card';

export const title = { en: 'Elevation in the dark theme', es: 'Elevación en el tema oscuro' };
export const description = {
  en: 'In dark mode, as in MUI, each elevation adds a white overlay (`--mtx-overlay-elevation-N`): elevation 8 looks lighter than elevation 1, and `outlined` has no overlay.',
  es: 'En modo oscuro, como en MUI, cada elevación suma una capa blanca (`--mtx-overlay-elevation-N`): la elevación 8 se ve más clara que la 1, y `outlined` no lleva capa.',
};

export default function Demo() {
  return (
    <div className="demo-surface" data-mtx-theme="dark">
      <Card elevation={0} title="Elevación 0" subheader="elevation={0}" className="demo-fixed-width">
        <CardContent>Sin sombra ni capa.</CardContent>
      </Card>
      <Card title="Elevación 1" subheader="Por defecto" className="demo-fixed-width">
        <CardContent>Capa blanca del 5 %.</CardContent>
      </Card>
      <Card elevation={8} title="Elevación 8" subheader="elevation={8}" className="demo-fixed-width">
        <CardContent>Capa blanca del 12 %.</CardContent>
      </Card>
      <Card variant="outlined" title="Outlined" subheader="Sin capa" className="demo-fixed-width">
        <CardContent>Solo borde.</CardContent>
      </Card>
    </div>
  );
}
