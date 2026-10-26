import { Tab, Tabs } from '@rubenchodev/materix-react/components/tabs';

export const title = { en: 'States', es: 'Estados' };
export const description = {
  en: "Active, disabled and available tabs. Hover to see the hover background, press to see the ripple and use Tab and the arrow keys to see the focus ring: the disabled tab is skipped.",
  es: "Pestañas activa, deshabilitada y disponible. Pasa el ratón para ver el fondo de hover, pulsa para ver el ripple y usa Tab y las flechas para ver el anillo de foco: la pestaña deshabilitada se salta.",
};

export default function Demo() {
  return (
    <div className="demo-group">
      <span className="demo-label">Activa · deshabilitada · disponible (hover, focus-visible, pulsada)</span>
      <Tabs aria-label="Estados">
        <Tab label="Activa" />
        <Tab label="Deshabilitada" disabled />
        <Tab label="Disponible" />
      </Tabs>
    </div>
  );
}
