import { Tab, Tabs } from '@rubenchodev/materix-react/components/tabs';

export const title = { en: 'With and without icons', es: 'Con y sin iconos' };
export const description = {
  en: "`icon` accepts a Material Icons name (rendered as a decorative `mtx-tab__icon` span) or your own node. `iconPosition` places it at the `start` (default) or the `end`. Icon-only tabs need an `aria-label`.",
  es: "`icon` acepta un nombre de Material Icons (se pinta como un span decorativo `mtx-tab__icon`) o un nodo propio. `iconPosition` lo coloca al inicio (`start`, por defecto) o al final (`end`). Las pestañas de solo icono necesitan `aria-label`.",
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">Solo texto</span>
        <Tabs aria-label="Solo texto">
          <Tab label="Llamadas" />
          <Tab label="Favoritos" />
          <Tab label="Contactos" />
        </Tabs>
      </div>
      <div className="demo-group">
        <span className="demo-label">Icono + texto (iconPosition=&quot;start&quot;)</span>
        <Tabs aria-label="Icono y texto">
          <Tab icon="phone" label="Llamadas" />
          <Tab icon="favorite" label="Favoritos" />
          <Tab icon="person_pin" label="Contactos" />
        </Tabs>
      </div>
      <div className="demo-group">
        <span className="demo-label">Texto + icono (iconPosition=&quot;end&quot;)</span>
        <Tabs aria-label="Texto e icono">
          <Tab icon="phone" iconPosition="end" label="Llamadas" />
          <Tab icon="favorite" iconPosition="end" label="Favoritos" />
          <Tab icon="person_pin" iconPosition="end" label="Contactos" />
        </Tabs>
      </div>
      <div className="demo-group">
        <span className="demo-label">Solo icono</span>
        <Tabs aria-label="Solo icono">
          <Tab icon="phone" aria-label="Llamadas" />
          <Tab icon="favorite" aria-label="Favoritos" />
          <Tab icon="person_pin" aria-label="Contactos" />
        </Tabs>
      </div>
    </div>
  );
}
