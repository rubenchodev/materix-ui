import { Skeleton } from '@rubenchodev/materix-react/components/skeleton';
import { Typography } from '@rubenchodev/materix-react/components/typography';

export const title = { en: 'Sizes', es: 'Tamaños' };
export const description = {
  en: 'The `text` variant inherits the size of the typography it sits in: just place it inside the same element that will hold the real text. Circular shapes follow the canonical Avatar sizes (24, 40 and 56px).',
  es: 'La variante `text` hereda el tamaño de la tipografía que la contiene: basta con colocarla dentro del mismo elemento que tendrá el texto real. Las formas circulares siguen los tamaños canónicos de Avatar (24, 40 y 56px).',
};

export default function Demo() {
  return (
    <div className="demo-stack demo-wide">
      {(['h3', 'h5', 'body1'] as const).map((variant) => (
        <div key={variant} className="demo-group">
          <span className="demo-label">{variant}</span>
          <Typography variant={variant} component="div">
            <Skeleton />
          </Typography>
        </div>
      ))}
      <div className="demo-group">
        <span className="demo-label">caption</span>
        <Typography variant="caption" component="div">
          <Skeleton width="40%" />
        </Typography>
      </div>
      <div className="demo-row">
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="circular" width={56} height={56} />
      </div>
    </div>
  );
}
