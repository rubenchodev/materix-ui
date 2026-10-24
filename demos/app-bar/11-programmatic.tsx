import { useState } from 'react';
import { AppBar } from '@rubenchodev/materix-react/components/app-bar';
import type { AppBarColor, AppBarPosition } from '@rubenchodev/materix-react/components/app-bar';
import { Button } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'Programmatic usage', es: 'Uso programático' };
export const description = {
  en: 'The vanilla `setColor()` and `setPosition()` methods become the `color` and `position` props: changing them is a re-render. The bar emits no events.',
  es: 'Los métodos `setColor()` y `setPosition()` de vanilla pasan a ser las props `color` y `position`: cambiarlas es un nuevo render. La barra no emite eventos.',
};

const colors: AppBarColor[] = ['primary', 'secondary', 'default', 'transparent'];
const positions: AppBarPosition[] = ['static', 'relative'];
const elevations = [0, 4, 8, 16];

/**
 * Grupo de botones de opción exclusiva.
 * @param {object} props Etiqueta, opciones, valor y callback.
 * @returns {JSX.Element} Grupo.
 */
function Options<T extends string | number>({ label, options, value, onChange }: { label: string; options: T[]; value: T; onChange: (next: T) => void }) {
  return (
    <div className="demo-row" role="group" aria-label={label}>
      {options.map((option) => (
        <Button key={option} variant={option === value ? 'contained' : 'outlined'} aria-pressed={option === value} onClick={() => onChange(option)}>
          {`${label.toLowerCase()} ${option}`}
        </Button>
      ))}
    </div>
  );
}

export default function Demo() {
  const [color, setColor] = useState<AppBarColor>('primary');
  const [position, setPosition] = useState<AppBarPosition>('static');
  const [elevation, setElevation] = useState(4);
  return (
    <div className="demo-stack">
      <AppBar position={position} color={color} elevation={elevation} title={`${color} · ${position} · elevation ${elevation}`} />
      <Options label="Color" options={colors} value={color} onChange={setColor} />
      <Options label="Position" options={positions} value={position} onChange={setPosition} />
      <Options label="Elevation" options={elevations} value={elevation} onChange={setElevation} />
    </div>
  );
}
