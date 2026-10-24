import { Fab } from '@rubenchodev/materix-react/components/fab';

export const title = { en: 'Variants', es: 'Variantes' };
export const description = {
  en: 'The circular FAB is the standard shape. The extended one adds a text label to make the action more explicit: enable it with `label`, or with `variant="extended"` if you write the content yourself.',
  es: 'El FAB circular es la forma estándar. El extendido añade un texto para hacer la acción más explícita: actívalo con `label`, o con `variant="extended"` si escribes tú el contenido.',
};

export default function Demo() {
  return (
    <div className="demo-grid-3">
      <div className="demo-group">
        <span className="demo-label">Circular</span>
        <div className="demo-row">
          <Fab icon="add" aria-label="Create" />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Extended · label</span>
        <div className="demo-row">
          <Fab icon="add" label="New ticket" />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Extended · variant + children</span>
        <div className="demo-row">
          <Fab variant="extended">
            <span className="material-icons" aria-hidden="true">
              add
            </span>
            <span>New ticket</span>
          </Fab>
        </div>
      </div>
    </div>
  );
}
