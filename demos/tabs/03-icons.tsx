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
        <span className="demo-label">Text only</span>
        <Tabs aria-label="Text only">
          <Tab label="Calls" />
          <Tab label="Favorites" />
          <Tab label="Contacts" />
        </Tabs>
      </div>
      <div className="demo-group">
        <span className="demo-label">Icon + text (iconPosition=&quot;start&quot;)</span>
        <Tabs aria-label="Icon and text">
          <Tab icon="phone" label="Calls" />
          <Tab icon="favorite" label="Favorites" />
          <Tab icon="person_pin" label="Contacts" />
        </Tabs>
      </div>
      <div className="demo-group">
        <span className="demo-label">Text + icon (iconPosition=&quot;end&quot;)</span>
        <Tabs aria-label="Text and icon">
          <Tab icon="phone" iconPosition="end" label="Calls" />
          <Tab icon="favorite" iconPosition="end" label="Favorites" />
          <Tab icon="person_pin" iconPosition="end" label="Contacts" />
        </Tabs>
      </div>
      <div className="demo-group">
        <span className="demo-label">Icon only</span>
        <Tabs aria-label="Icon only">
          <Tab icon="phone" aria-label="Calls" />
          <Tab icon="favorite" aria-label="Favorites" />
          <Tab icon="person_pin" aria-label="Contacts" />
        </Tabs>
      </div>
    </div>
  );
}
