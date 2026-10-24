import { Card, CardContent } from '@rubenchodev/materix-react/components/card';

export const title = { en: 'Media', es: 'Imagen' };
export const description = {
  en: '`image` generates a full-bleed 194px `CardMedia` below the header; `mediaTop` places it at the top and `mediaHeight` changes the height. Without `imageAlt` the image is decorative.',
  es: '`image` genera un `CardMedia` a sangre de 194px bajo el encabezado; `mediaTop` lo coloca arriba y `mediaHeight` cambia el alto. Sin `imageAlt` la imagen es decorativa.',
};

export default function Demo() {
  return (
    <div className="demo-surface">
      <div className="demo-group">
        <span className="demo-label">Below the header</span>
        <Card
          title="Moscow"
          subheader="Russia"
          className="demo-fixed-width"
          image="https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=800&q=80"
        >
          <CardContent>Saint Basil&apos;s Cathedral and Red Square.</CardContent>
        </Card>
      </div>
      <div className="demo-group">
        <span className="demo-label">Top · 140px</span>
        <Card
          variant="outlined"
          mediaTop
          mediaHeight={140}
          title="Green lizard"
          subheader="Reptilia · Squamata"
          className="demo-fixed-width"
          image="https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?auto=format&fit=crop&w=800&q=80"
          imageAlt="Green lizard on a branch"
        >
          <CardContent>More than 6,000 species on every continent except Antarctica.</CardContent>
        </Card>
      </div>
    </div>
  );
}
