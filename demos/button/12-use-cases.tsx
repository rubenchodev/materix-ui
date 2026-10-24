import { Button } from '@rubenchodev/materix-react/components/button';
import { TextField } from '@rubenchodev/materix-react/components/text-field';

export const title = { en: 'Use cases', es: 'Casos de uso' };
export const description = {
  en: "Common compositions: a single contained primary action per block, with the secondary actions in outlined or text next to it.",
  es: "Composiciones habituales: una única acción principal contained por bloque, con las acciones secundarias en outlined o text a su lado.",
};

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">Form footer</span>
        <div className="demo-panel">
          <TextField label="Project name" type="text" />
          <div className="demo-row">
            <Button>Cancel</Button>
            <Button variant="contained" startIcon="check">Create project</Button>
          </div>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Table action bar</span>
        <div className="demo-panel">
          <div className="demo-row">
            <Button variant="contained" size="small" startIcon="add">Add</Button>
            <Button variant="outlined" size="small" startIcon="file_download">Export</Button>
            <Button size="small" color="error">Delete selection</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
