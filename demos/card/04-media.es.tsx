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
        <span className="demo-label">Bajo el encabezado</span>
        <Card
          title="Moscú"
          subheader="Rusia"
          className="demo-fixed-width"
          image="https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=800&q=80"
        >
          <CardContent>La catedral de San Basilio y la Plaza Roja.</CardContent>
        </Card>
      </div>
      <div className="demo-group">
        <span className="demo-label">Arriba · 140px</span>
        <Card
          variant="outlined"
          mediaTop
          mediaHeight={140}
          title="Lagarto verde"
          subheader="Reptilia · Squamata"
          className="demo-fixed-width"
          image="https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?auto=format&fit=crop&w=800&q=80"
          imageAlt="Lagarto verde sobre una rama"
        >
          <CardContent>Más de 6000 especies en todos los continentes salvo la Antártida.</CardContent>
        </Card>
      </div>
    </div>
  );
}
