import { Button } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'States', es: 'Estados' };
export const description = {
  en: "Hover to see the hover state, press to see the ripple and use Tab to see the visible focus. The native `disabled` attribute dims the button and removes it from the tab order.",
  es: "Pasa el ratón para ver el hover, pulsa para ver el ripple y usa Tab para ver el foco visible. El atributo nativo `disabled` atenúa el botón y lo saca del orden de tabulación.",
};

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">Enabled · hover, focus and press</span>
        <div className="demo-row">
          <Button variant="contained">Contained</Button>
          <Button variant="outlined">Outlined</Button>
          <Button variant="text">Text</Button>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Disabled · disabled</span>
        <div className="demo-row">
          <Button variant="contained" disabled>Contained</Button>
          <Button variant="outlined" disabled>Outlined</Button>
          <Button variant="text" disabled>Text</Button>
        </div>
      </div>
    </div>
  );
}
