import { IconButton } from '@rubenchodev/materix-react/components/icon-button';

export const title = { en: 'Use cases', es: 'Casos de uso' };
export const description = {
  en: 'A text formatting toolbar and the actions of a row: the typical use is groups of IconButtons of the same size.',
  es: 'Una barra de formato de texto y las acciones de una fila: el uso típico son grupos de IconButton del mismo tamaño.',
};

const formats = [
  ['format_bold', 'Negrita'],
  ['format_italic', 'Cursiva'],
  ['format_underlined', 'Subrayado'],
  ['format_list_bulleted', 'Lista'],
  ['link', 'Insertar enlace'],
] as const;

export default function Demo() {
  const file = 'informe-trimestral.pdf';
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">Barra del editor</span>
        <div className="demo-panel">
          <div className="demo-row" role="toolbar" aria-label="Formato de texto">
            {formats.map(([icon, label]) => (
              <IconButton key={icon} icon={icon} size="small" aria-label={label} />
            ))}
          </div>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Acciones de un elemento</span>
        <div className="demo-panel">
          <div className="demo-row">
            <span>{file}</span>
            <IconButton icon="download" aria-label={`Descargar ${file}`} />
            <IconButton icon="edit" aria-label={`Renombrar ${file}`} />
            <IconButton icon="delete" color="error" aria-label={`Eliminar ${file}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
