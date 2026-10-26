import { Grid } from '@rubenchodev/materix-react/components/grid';
import { Link } from '@rubenchodev/materix-react/components/link';

export const title = { en: 'In a grid', es: 'En una grilla' };
export const description = {
  en: 'Footer with columns of links in a `Grid`: one column on mobile, two on tablet and four on desktop.',
  es: 'Pie de página con columnas de enlaces en un `Grid`: una columna en móvil, dos en tableta y cuatro en escritorio.',
};

const columns = [
  { heading: 'Producto', links: ['Funciones', 'Precios'] },
  { heading: 'Recursos', links: ['Documentación', 'Ejemplos'] },
  { heading: 'Empresa', links: ['Equipo', 'Contacto'] },
  { heading: 'Legal', links: ['Privacidad', 'Términos'] },
];

export default function Demo() {
  return (
    <Grid container spacing={2}>
      {columns.map(({ heading, links }) => (
        <Grid key={heading} xs={12} sm={6} md={3}>
          <div className="demo-stack">
            <span className="demo-label">{heading}</span>
            {links.map((text) => (
              <Link key={text} href="#grid" color="text-primary">
                {text}
              </Link>
            ))}
          </div>
        </Grid>
      ))}
    </Grid>
  );
}
