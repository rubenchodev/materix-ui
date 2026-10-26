import { IconButton } from '@rubenchodev/materix-react/components/icon-button';

export const title = { en: 'Edge position', es: 'Posición en el borde' };
export const description = {
  en: '`edge="start|end"` applies a negative 12px margin so the glyph lines up optically with the edge of the content (MUI `edge`). Notice how the menu icon lines up with the text of the row below.',
  es: '`edge="start|end"` aplica un margen negativo de 12px para que el glifo quede alineado ópticamente con el borde del contenido (`edge` de MUI). Observa cómo el icono de menú se alinea con el texto de la fila inferior.',
};

export default function Demo() {
  return (
    <div className="demo-panel">
      <div className="demo-row">
        <IconButton icon="menu" edge="start" aria-label="Abrir menú" />
        <span>Bandeja de entrada</span>
      </div>
      <div className="demo-row">
        <span>Ajustes de la cuenta</span>
        <IconButton icon="chevron_right" edge="end" aria-label="Abrir ajustes de la cuenta" />
      </div>
    </div>
  );
}
