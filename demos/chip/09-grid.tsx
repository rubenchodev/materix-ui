import { Chip, type ChipColor } from '@rubenchodev/materix-react/components/chip';
import { Grid } from '@rubenchodev/materix-react/components/grid';

export const title = { en: 'Grid', es: 'Grilla' };
export const description = {
  en: 'Project cards in a Grid with their tags: 1 column on mobile, 2 at `sm` and 3 at `md`.',
  es: 'Tarjetas de proyectos en una Grid con sus etiquetas: 1 columna en móvil, 2 en `sm` y 3 en `md`.',
};

const PROJECTS: Array<{ name: string; status: string; color: ChipColor; tag: string }> = [
  { name: 'Customer portal', status: 'Active', color: 'success', tag: 'Web' },
  { name: 'Mobile app', status: 'At risk', color: 'warning', tag: 'iOS' },
  { name: 'ERP migration', status: 'Blocked', color: 'error', tag: 'Backend' },
];

export default function Demo() {
  return (
    <Grid container spacing={2}>
      {PROJECTS.map((project) => (
        <Grid key={project.name} size={{ xs: 12, sm: 6, md: 4 }}>
          <div className="demo-panel">
            <strong>{project.name}</strong>
            <div className="demo-row">
              <Chip label={project.status} size="small" color={project.color} />
              <Chip label={project.tag} size="small" variant="outlined" />
            </div>
          </div>
        </Grid>
      ))}
    </Grid>
  );
}
