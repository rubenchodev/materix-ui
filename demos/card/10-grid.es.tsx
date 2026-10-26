import { Button } from '@rubenchodev/materix-react/components/button';
import { Card, CardActions, CardContent } from '@rubenchodev/materix-react/components/card';
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';

export const title = { en: 'Product grid', es: 'Cuadrícula de productos' };
export const description = {
  en: 'Cards take the width of their column: 1, 2 or 3 columns depending on the screen width.',
  es: 'Las tarjetas toman el ancho de su columna: 1, 2 o 3 columnas según el ancho de pantalla.',
};

const products = [
  { name: 'Reloj clásico', text: 'Correa de cuero y esfera blanca. 89,00 €', image: 'photo-1523275335684-37898b6baf30' },
  { name: 'Auriculares', text: 'Cancelación de ruido, 30 h de batería. 149,00 €', image: 'photo-1505740420928-5e560c06d30e' },
  { name: 'Zapatillas', text: 'Ligeras y transpirables. 75,00 €', image: 'photo-1542291026-7eec264c27ff' },
];

export default function Demo() {
  return (
    <div className="demo-grid-3">
      {products.map((product) => (
        <Card
          key={product.name}
          mediaTop
          mediaHeight={160}
          image={`https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=800&q=80`}
        >
          <CardContent>
            <h3>{product.name}</h3>
            <p>{product.text}</p>
          </CardContent>
          <CardActions>
            <Button variant="contained">Añadir al carrito</Button>
            <IconButton
              icon="favorite_border"
              aria-label={`Guardar ${product.name.toLowerCase()}`}
              className="mtx-card__actions-end"
            />
          </CardActions>
        </Card>
      ))}
    </div>
  );
}
