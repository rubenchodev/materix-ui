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
        <span className="demo-label">Solo título</span>
        <Card title="Informe trimestral" className="demo-fixed-width">
          <CardContent>Resultados del tercer trimestre.</CardContent>
        </Card>
      </div>
      <div className="demo-group">
        <span className="demo-label">Avatar, título y subtítulo</span>
        <Card avatar="AM" title="Ana Martín" subheader="Diseño de producto" className="demo-fixed-width">
          <CardContent>Disponible para revisiones esta semana.</CardContent>
        </Card>
      </div>
      <div className="demo-group">
        <span className="demo-label">Con icono de acción</span>
        <Card
          avatar="JS"
          title="JavaScript moderno"
          subheader="Curso · 12 lecciones"
          actionIcon="more_vert"
          actionLabel="Opciones del curso"
          className="demo-fixed-width"
        >
          <CardContent>Módulos, código asíncrono y patrones.</CardContent>
        </Card>
      </div>
    </div>
  );
}
