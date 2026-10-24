import { Card, CardContent } from '@rubenchodev/materix-react/components/card';

export const title = { en: 'Header', es: 'Encabezado' };
export const description = {
  en: 'The header is generated when there is a `title`, `subheader` or `avatar` (text of a primary Avatar). `actionIcon` adds an IconButton on the right, named by `actionLabel`.',
  es: 'El encabezado se genera si hay `title`, `subheader` o `avatar` (texto de un Avatar primario). `actionIcon` añade un IconButton a la derecha, con el nombre de `actionLabel`.',
};

export default function Demo() {
  return (
    <div className="demo-surface">
      <div className="demo-group">
        <span className="demo-label">Title only</span>
        <Card title="Quarterly report" className="demo-fixed-width">
          <CardContent>Third-quarter results.</CardContent>
        </Card>
      </div>
      <div className="demo-group">
        <span className="demo-label">Avatar, title and subheader</span>
        <Card avatar="AM" title="Anna Miller" subheader="Product design" className="demo-fixed-width">
          <CardContent>Available for reviews this week.</CardContent>
        </Card>
      </div>
      <div className="demo-group">
        <span className="demo-label">With action icon</span>
        <Card
          avatar="JS"
          title="Modern JavaScript"
          subheader="Course · 12 lessons"
          actionIcon="more_vert"
          actionLabel="Course options"
          className="demo-fixed-width"
        >
          <CardContent>Modules, async code and patterns.</CardContent>
        </Card>
      </div>
    </div>
  );
}
