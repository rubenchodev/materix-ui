import { Skeleton } from '@rubenchodev/materix-react/components/skeleton';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: 'Without a variant, `Skeleton` is a line of text that fills the available width and takes the height of the typography; `width` and `height` accept numbers (px) or any CSS unit.',
  es: 'Sin variante, `Skeleton` es una línea de texto que ocupa el ancho disponible y toma la altura de la tipografía; `width` y `height` aceptan números (px) o cualquier unidad CSS.',
};

export default function Demo() {
  return (
    <div className="demo-stack demo-wide">
      <Skeleton />
      <Skeleton variant="circular" width={40} height={40} />
      <Skeleton variant="rectangular" width={210} height={60} />
      <Skeleton variant="rounded" width={210} height={60} />
    </div>
  );
}
