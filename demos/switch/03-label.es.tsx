import { Switch } from '@rubenchodev/materix-react/components/switch';

export const title = { en: 'With and without label', es: 'Con y sin etiqueta' };
export const description = {
  en: "Without label only the switch is drawn; in that case add aria-label or aria-labelledby to give it an accessible name.",
  es: "Sin label solo se dibuja el interruptor; en ese caso añade aria-label o aria-labelledby para darle nombre accesible.",
};

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">Con etiqueta visible</span>
        <div className="demo-row">
          <Switch label="Modo avión" />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Solo interruptor · aria-label</span>
        <div className="demo-row">
          <Switch aria-label="Sincronización automática" defaultChecked />
          <Switch aria-label="Sincronización automática (pequeño)" size="small" />
        </div>
      </div>
    </div>
  );
}
