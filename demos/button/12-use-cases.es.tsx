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
        <span className="demo-label">Pie de formulario</span>
        <div className="demo-panel">
          <TextField label="Nombre del proyecto" type="text" />
          <div className="demo-row">
            <Button>Cancelar</Button>
            <Button variant="contained" startIcon="check">Crear proyecto</Button>
          </div>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Barra de acciones de tabla</span>
        <div className="demo-panel">
          <div className="demo-row">
            <Button variant="contained" size="small" startIcon="add">Añadir</Button>
            <Button variant="outlined" size="small" startIcon="file_download">Exportar</Button>
            <Button size="small" color="error">Eliminar selección</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
