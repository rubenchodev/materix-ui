import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Menu, MenuItem, Submenu, useMenu } from '@rubenchodev/materix-react/components/menu';

export const title = { en: 'Submenus', es: 'Submenús' };
export const description = {
  en: '`<Submenu label>` opens a nested menu next to its item: on hover (100 ms), on click or with →, Enter or Space; ← or Escape go back. Choosing an option closes the whole chain and reaches the root `onSelect`. In RTL it opens to the left and the arrow keys are mirrored.',
  es: '`<Submenu label>` abre un menú anidado junto a su ítem: con hover (100 ms), con clic o con →, Enter o Espacio; ← o Escape vuelven. Elegir una opción cierra toda la cadena y llega al `onSelect` raíz. En RTL se abre hacia la izquierda y las flechas se invierten.',
};

/** Menú "Insertar" con dos niveles de submenús. */
function InsertMenu({ label, onPick }: { label: string; onPick: (value: string) => void }) {
  const menu = useMenu();
  return (
    <>
      <Button variant="outlined" {...menu.triggerProps}>
        {label}
      </Button>
      <Menu {...menu.menuProps} onSelect={({ value }) => value && onPick(value)}>
        <MenuItem icon="image" value="image">
          Imagen
        </MenuItem>
        <MenuItem icon="table_chart" value="table">
          Tabla
        </MenuItem>
        <Submenu label="Compartir" icon="share">
          <MenuItem icon="mail" value="email">
            Por correo
          </MenuItem>
          <MenuItem icon="link" value="link">
            Copiar enlace
          </MenuItem>
          <Submenu label="Redes sociales">
            <MenuItem value="mastodon">Mastodon</MenuItem>
            <MenuItem value="linkedin">LinkedIn</MenuItem>
          </Submenu>
        </Submenu>
      </Menu>
    </>
  );
}

export default function Demo() {
  const [picked, setPicked] = useState('—');
  return (
    <div className="demo-row">
      <div className="demo-group">
        <span className="demo-label">LTR</span>
        <div className="demo-row">
          <InsertMenu label="Insertar" onPick={setPicked} />
        </div>
      </div>
      <div className="demo-group" dir="rtl" lang="ar">
        <span className="demo-label">RTL</span>
        <div className="demo-row">
          <InsertMenu label="إدراج" onPick={setPicked} />
        </div>
      </div>
      <span className="demo-status" aria-live="polite">
        Seleccionado: {picked}
      </span>
    </div>
  );
}
