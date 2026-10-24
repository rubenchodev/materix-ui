import { Chip } from '@rubenchodev/materix-react/components/chip';
import { Stack } from '@rubenchodev/materix-react/components/stack';

export const title = { en: 'Wrap', es: 'Ajuste de línea' };

export const description = {
  en: 'With `wrap` the children move to the next line when they do not fit (useful for groups of chips or buttons). The `gap` also separates the lines.',
  es: 'Con `wrap` los hijos pasan a la línea siguiente cuando no caben (útil para grupos de chips o botones). El `gap` también separa las líneas.',
};

const tags = ['JavaScript', 'CSS', 'HTML', 'Accessibility', 'Material UI', 'Responsive design', 'Vanilla', 'Design tokens'];

export default function Demo() {
  return (
    <Stack direction="row" spacing={1} wrap>
      {tags.map((tag) => (
        <Chip key={tag} label={tag} />
      ))}
    </Stack>
  );
}
