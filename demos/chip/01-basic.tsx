import { Chip } from '@rubenchodev/materix-react/components/chip';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: 'A single `<Chip label>`; `icon` adds a start icon and `onDelete` the delete icon.',
  es: 'Basta con `<Chip label>`; `icon` añade un icono inicial y `onDelete` el icono de eliminar.',
};

export default function Demo() {
  return (
    <div className="demo-row">
      <Chip label="Tag" />
      <Chip label="JavaScript" icon="code" color="primary" />
      <Chip label="Deletable" color="secondary" onDelete={() => {}} />
      <Chip label="Outlined" variant="outlined" icon="tag" />
    </div>
  );
}
