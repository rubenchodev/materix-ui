import { Button } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'With icons', es: 'Con iconos' };
export const description = {
  en: "With `startIcon` / `endIcon` the Material icon name is enough: the button generates `<span class=\"mtx-button__icon mtx-button__icon--start material-icons\" aria-hidden=\"true\">` (or `--end`). Any node (an `<svg>`) is also accepted. The icons are decorative because the text already names the action, and they move 4px closer to the edge (2px in small) as in MUI.",
  es: "Con `startIcon` / `endIcon` basta el nombre del icono de Material: el botón genera `<span class=\"mtx-button__icon mtx-button__icon--start material-icons\" aria-hidden=\"true\">` (o `--end`). También acepta cualquier nodo (un `<svg>`). Los iconos son decorativos porque el texto ya nombra la acción, y se acercan 4px al borde (2px en small) como en MUI.",
};

const GITHUB =
  'M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z';

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">No icon</span>
        <div className="demo-row">
          <Button variant="contained">Send</Button>
          <Button variant="outlined">Delete</Button>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Start icon</span>
        <div className="demo-row">
          <Button variant="contained" startIcon="add">New</Button>
          <Button variant="outlined" color="error" startIcon="delete">Delete</Button>
          <Button startIcon="download">Download</Button>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">SVG icon (24px)</span>
        <div className="demo-row">
          <Button
            variant="outlined"
            startIcon={
              <svg viewBox="0 0 24 24">
                <path d={GITHUB} />
              </svg>
            }
          >
            Continue with GitHub
          </Button>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">End icon</span>
        <div className="demo-row">
          <Button variant="contained" endIcon="send">Send</Button>
          <Button variant="outlined" href="#colors" endIcon="arrow_forward">Next</Button>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Start and end · three sizes (48 / 40 / 32px)</span>
        <div className="demo-row">
          <Button variant="contained" size="large" startIcon="save" endIcon="expand_more">Large</Button>
          <Button variant="outlined" startIcon="save" endIcon="expand_more">Medium</Button>
          <Button size="small" startIcon="save" endIcon="expand_more">Small</Button>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Icon only · iconOnly (48 / 40 / 32px)</span>
        <div className="demo-row">
          <Button variant="contained" iconOnly size="large" aria-label="Large favorite" startIcon="star" />
          <Button variant="contained" iconOnly aria-label="Favorite" startIcon="star" />
          <Button variant="contained" iconOnly size="small" aria-label="Small favorite" startIcon="star" />
        </div>
      </div>
    </div>
  );
}
