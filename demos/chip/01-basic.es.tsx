import { Chip } from '@rubenchodev/materix-react/components/chip';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: 'A single `<Chip label>`; `icon` adds a start icon and `onDelete` the delete icon.',
  es: 'Basta con `<Chip label>`; `icon` añade un icono inicial y `onDelete` el icono de eliminar.',
};

export default function Demo() {
  return (
    <div className="demo-row">
      <Chip label="Etiqueta" />
      <Chip label="JavaScript" icon="code" color="primary" />
      <Chip label="Eliminable" color="secondary" onDelete={() => {}} />
      <Chip label="Con borde" variant="outlined" icon="tag" />
    </div>
  );
}
