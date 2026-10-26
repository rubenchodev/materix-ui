import { TextField } from '@rubenchodev/materix-react/components/text-field';

export const title = { en: 'Static, hidden and borderless label', es: 'Label estático, oculto y sin borde' };
export const description = {
  en: '`staticLabel` (label always on top and placeholder visible), `hiddenLabel` and `borderless`, the React props for the vanilla BEM modifiers; `margin` and `fullWidth` work like in MUI.',
  es: '`staticLabel` (label siempre arriba y placeholder visible), `hiddenLabel` y `borderless`, las props React de los modificadores BEM de vanilla; `margin` y `fullWidth` funcionan como en MUI.',
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-grid-3">
        <div className="demo-group">
          <span className="demo-label">Label estático</span>
          <TextField staticLabel label="Apodo" placeholder="¿Cómo quieres que te llamemos?" />
        </div>
        <div className="demo-group">
          <span className="demo-label">Label oculto</span>
          <TextField hiddenLabel label="Ciudad" placeholder="Ciudad" aria-label="Ciudad" />
        </div>
        <div className="demo-group">
          <span className="demo-label">Sin borde</span>
          <TextField borderless variant="no-label" startIcon="search" placeholder="Búsqueda sin borde" aria-label="Buscar" type="search" />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">margin · none / dense / normal, y fullWidth</span>
        <div className="demo-grid-3">
          <TextField label="margin none" />
          <TextField label="margin dense" margin="dense" />
          <TextField label="margin normal" margin="normal" fullWidth />
        </div>
      </div>
    </div>
  );
}
