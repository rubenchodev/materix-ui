import { IconButton } from '@rubenchodev/materix-react/components/icon-button';

export const title = { en: 'Use cases', es: 'Casos de uso' };
export const description = {
  en: 'A text formatting toolbar and the actions of a row: the typical use is groups of IconButtons of the same size.',
  es: 'Una barra de formato de texto y las acciones de una fila: el uso típico son grupos de IconButton del mismo tamaño.',
};

const formats = [
  ['format_bold', 'Bold'],
  ['format_italic', 'Italic'],
  ['format_underlined', 'Underline'],
  ['format_list_bulleted', 'List'],
  ['link', 'Insert link'],
] as const;

export default function Demo() {
  const file = 'quarterly-report.pdf';
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">Editor toolbar</span>
        <div className="demo-panel">
          <div className="demo-row" role="toolbar" aria-label="Text formatting">
            {formats.map(([icon, label]) => (
              <IconButton key={icon} icon={icon} size="small" aria-label={label} />
            ))}
          </div>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Item actions</span>
        <div className="demo-panel">
          <div className="demo-row">
            <span>{file}</span>
            <IconButton icon="download" aria-label={`Download ${file}`} />
            <IconButton icon="edit" aria-label={`Rename ${file}`} />
            <IconButton icon="delete" color="error" aria-label={`Delete ${file}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
