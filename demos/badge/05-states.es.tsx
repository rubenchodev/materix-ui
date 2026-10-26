import { Badge } from '@rubenchodev/materix-react/components/badge';

export const title = { en: 'States', es: 'Estados' };
export const description = {
  en: 'The badge is hidden when the value is `0` or empty. `showZero` shows the zero, `invisible` always hides it and `max` (99 by default) caps the number.',
  es: 'La insignia se oculta cuando el valor es `0` o está vacío. `showZero` muestra el cero, `invisible` la oculta siempre y `max` (99 por defecto) limita el número.',
};

const icon = <span className="material-icons" aria-hidden="true">mail</span>;

export default function Demo() {
  return (
    <>
      <div className="demo-group">
        <span className="demo-label">Valor 0 · con showZero · invisible</span>
        <div className="demo-row mtx-gap-4 mtx-pt-1 mtx-px-1">
          <Badge badgeContent={0} color="primary">{icon}</Badge>
          <Badge badgeContent={0} showZero color="primary">{icon}</Badge>
          <Badge badgeContent={5} invisible color="primary">{icon}</Badge>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Valor máximo: 99 con max 9 · 150 (max 99) · 1000 con max 999</span>
        <div className="demo-row mtx-gap-4 mtx-pt-1 mtx-px-1">
          <Badge badgeContent={99} max={9} color="error">{icon}</Badge>
          <Badge badgeContent={150} color="error">{icon}</Badge>
          <Badge badgeContent={1000} max={999} color="error">{icon}</Badge>
        </div>
      </div>
    </>
  );
}
