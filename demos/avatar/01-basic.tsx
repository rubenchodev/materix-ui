import { Avatar } from '@rubenchodev/materix-react/components/avatar';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: 'A single `Avatar`: initials go as children, `src` renders the image and `icon` inserts a Material icon.',
  es: 'Un solo `Avatar`: las iniciales van como hijos, `src` genera la imagen e `icon` inserta un icono de Material.',
};

export default function Demo() {
  return (
    <div className="demo-row">
      <Avatar color="primary">RD</Avatar>
      <Avatar icon="folder" color="secondary" role="img" aria-label="Folder" />
      <Avatar src="https://i.pravatar.cc/120?img=47" alt="Anna Grant" />
      <Avatar icon="assignment" variant="rounded" color="success" role="img" aria-label="Tasks" />
    </div>
  );
}
