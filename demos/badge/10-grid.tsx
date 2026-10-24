import { Badge, type BadgeColor } from '@rubenchodev/materix-react/components/badge';
import { Grid } from '@rubenchodev/materix-react/components/grid';

export const title = { en: 'Grid layout', es: 'Maquetación en grilla' };
export const description = {
  en: 'Dashboard shortcuts in `Grid`: 2 columns on mobile and 4 from `md`.',
  es: 'Accesos de un panel en `Grid`: 2 columnas en móvil y 4 desde `md`.',
};

const items: Array<{ icon: string; label: string; content?: number; color: BadgeColor; dot?: boolean }> = [
  { icon: 'mail', label: 'Mail', content: 4, color: 'primary' },
  { icon: 'notifications', label: 'Alerts', content: 120, color: 'error' },
  { icon: 'chat', label: 'Chat', color: 'success', dot: true },
  { icon: 'event', label: 'Calendar', content: 0, color: 'info' },
];

export default function Demo() {
  return (
    <Grid container spacing={2} className="mtx-w-100">
      {items.map((item) => (
        <Grid key={item.label} xs={6} md={3}>
          <div className="demo-panel">
            <Badge badgeContent={item.content} variant={item.dot ? 'dot' : 'standard'} color={item.color}>
              <span className="material-icons" aria-hidden="true">{item.icon}</span>
            </Badge>
            <span>{item.label}</span>
          </div>
        </Grid>
      ))}
    </Grid>
  );
}
