import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'Alignment', es: 'Alineación' };
export const description = {
  en: '`align` accepts `left`, `center`, `right` and `justify`.',
  es: '`align` acepta `left`, `center`, `right` y `justify`.',
};

export default function Demo() {
  return (
    <div className="demo-panel">
      <Typography align="left" className="demo-wide">
        Left aligned
      </Typography>
      <Typography align="center" className="demo-wide">
        Centered
      </Typography>
      <Typography align="right" className="demo-wide">
        Right aligned
      </Typography>
      <Typography variant="body2" align="justify" className="demo-wide">
        Justified text: full lines are spread across the container width so both margins line up, which is useful for long
        reading blocks.
      </Typography>
    </div>
  );
}
