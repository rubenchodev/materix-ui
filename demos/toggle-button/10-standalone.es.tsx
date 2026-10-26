import { useState } from 'react';
import { ToggleButton } from '@rubenchodev/materix-react/components/toggle-button';

export const title = { en: 'Standalone button', es: 'Botón independiente' };
export const description = {
  en: "Outside a group a `ToggleButton` toggles its own state (`defaultSelected`) or is controlled with `selected` and `onChange(event, selected, value)`.",
  es: "Fuera de un grupo un `ToggleButton` alterna su propio estado (`defaultSelected`) o se controla con `selected` y `onChange(event, selected, value)`.",
};

export default function Demo() {
  const [favorite, setFavorite] = useState(false);
  return (
    <div className="demo-row">
      <ToggleButton
        value="favorite"
        icon={favorite ? 'star' : 'star_border'}
        color="warning"
        selected={favorite}
        onChange={(_, selected) => setFavorite(selected)}
        aria-label="Marcar como favorito"
      />
      <ToggleButton value="done" icon="check" color="success" defaultSelected aria-label="Marcar como hecho" />
      <ToggleButton value="wifi" icon="wifi" size="small" defaultSelected>
        Wi-Fi
      </ToggleButton>
    </div>
  );
}
