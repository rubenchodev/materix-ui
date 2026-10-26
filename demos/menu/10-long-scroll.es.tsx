import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Menu, MenuItem, useMenu } from '@rubenchodev/materix-react/components/menu';

export const title = { en: 'Long scroll', es: 'Desplazamiento largo' };
export const description = {
  en: 'With many options the height is limited to the available space and the content scrolls. Type a letter to jump to the next option that starts with it.',
  es: 'Con muchas opciones el alto se limita al espacio disponible y el contenido se desplaza. Escribe una letra para saltar a la siguiente opción que empieza por ella.',
};

const COUNTRIES = [
  'Argentina', 'Bolivia', 'Brasil', 'Chile', 'Colombia', 'Costa Rica', 'Cuba', 'Ecuador',
  'El Salvador', 'España', 'Guatemala', 'Honduras', 'México', 'Nicaragua', 'Panamá', 'Paraguay',
  'Perú', 'Puerto Rico', 'República Dominicana', 'Uruguay', 'Venezuela',
];

export default function Demo() {
  const menu = useMenu();
  const [country, setCountry] = useState<string | null>(null);
  return (
    <div className="demo-row">
      <Button variant="outlined" {...menu.triggerProps}>
        {country ?? 'País'}
      </Button>
      <Menu {...menu.menuProps} dense onSelect={({ value }) => value && setCountry(value)}>
        {COUNTRIES.map((name) => (
          <MenuItem key={name} value={name} selected={name === country}>
            {name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
