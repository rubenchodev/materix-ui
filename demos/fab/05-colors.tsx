import { Fab } from '@rubenchodev/materix-react/components/fab';

export const title = { en: 'Colors', es: 'Colores' };
export const description = {
  en: 'Primary is the default. `color` accepts any palette color plus `default`, a neutral surface with a border for screens where the primary color is already very present.',
  es: 'Primary es el color por defecto. `color` acepta cualquier color de la paleta y `default`, una superficie neutra con borde para pantallas donde el color primario ya está muy presente.',
};

export default function Demo() {
  return (
    <>
      <div className="demo-row">
        <Fab icon="add" aria-label="Primary" />
        <Fab icon="edit" color="secondary" aria-label="Secondary" />
        <Fab icon="favorite" color="default" aria-label="Default" />
        <Fab icon="check" color="success" aria-label="Success" />
        <Fab icon="delete" color="error" aria-label="Error" />
        <Fab icon="warning" color="warning" aria-label="Warning" />
        <Fab icon="info" color="info" aria-label="Info" />
      </div>
      <div className="demo-row">
        <Fab icon="support_agent" label="Support" color="secondary" />
        <Fab icon="filter_list" label="Filter" color="default" />
      </div>
    </>
  );
}
