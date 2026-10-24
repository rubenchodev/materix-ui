import { Chip } from '@rubenchodev/materix-react/components/chip';
import { Button } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'Sizes', es: 'Tamaños' };
export const description = {
  en: '`medium` (32px, default) lines up with the small Button; `small` (24px) suits tables and dense lists.',
  es: '`medium` (32px, por defecto) alinea con el Button pequeño; `small` (24px) encaja en tablas y listas densas.',
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">Medium · 32px</span>
        <div className="demo-row">
          <Chip label="Medium" icon="star" />
          <Chip label="Deletable" color="primary" onDelete={() => {}} />
          <Chip label="Outlined" variant="outlined" />
          <Button variant="outlined" size="small">
            Button 32px
          </Button>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Small · 24px</span>
        <div className="demo-row">
          <Chip label="Small" size="small" icon="star" />
          <Chip label="Deletable" size="small" color="primary" onDelete={() => {}} />
          <Chip label="Outlined" size="small" variant="outlined" />
        </div>
      </div>
    </div>
  );
}
