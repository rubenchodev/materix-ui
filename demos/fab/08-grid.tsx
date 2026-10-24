import { Fab } from '@rubenchodev/materix-react/components/fab';
import type { FabColor } from '@rubenchodev/materix-react/components/fab';
import { Grid } from '@rubenchodev/materix-react/components/grid';

export const title = { en: 'Grid layout', es: 'Maquetación en grilla' };
export const description = {
  en: 'Inside a Grid the FAB keeps its size; use it as the primary action of each card or column.',
  es: 'Dentro de un Grid el FAB mantiene su tamaño; úsalo como acción principal de cada tarjeta o columna.',
};

const items: Array<[string, string, string, FabColor]> = [
  ['Notes', 'note_add', 'New note', 'primary'],
  ['Events', 'event', 'New event', 'secondary'],
  ['Contacts', 'person_add', 'New contact', 'success'],
];

export default function Demo() {
  return (
    <Grid container spacing={2}>
      {items.map(([section, icon, label, color]) => (
        <Grid key={section} size={{ xs: 12, sm: 4 }}>
          <div className="demo-panel">
            <span className="demo-label">{section}</span>
            <Fab icon={icon} size="small" color={color} aria-label={label} />
          </div>
        </Grid>
      ))}
    </Grid>
  );
}
