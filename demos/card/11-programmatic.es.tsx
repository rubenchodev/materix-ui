import { useRef, useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Card, CardActionArea, CardContent, CardMedia } from '@rubenchodev/materix-react/components/card';

export const title = { en: 'Programmatic usage', es: 'Uso programático' };
export const description = {
  en: 'The vanilla methods become props and refs: `disabled` replaces `disable()`/`enable()`, `ref.current.focus()` replaces `focus()` and the `image` prop of `CardMedia` replaces its setter. Listen to `onClick`.',
  es: 'Los métodos de vanilla pasan a props y refs: `disabled` sustituye a `disable()`/`enable()`, `ref.current.focus()` a `focus()` y la prop `image` de `CardMedia` a su setter. Escucha `onClick`.',
};

const images = [
  'https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=800&q=80',
];

export default function Demo() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardDisabled, setCardDisabled] = useState(false);
  const [areaDisabled, setAreaDisabled] = useState(false);
  const [image, setImage] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const write = (text: string) => setLog((prev) => [...prev.slice(-5), `${new Date().toLocaleTimeString()}  ${text}`]);

  return (
    <div className="demo-stack">
      <div className="demo-surface">
        <Card
          ref={cardRef}
          clickable
          disabled={cardDisabled}
          variant="outlined"
          avatar="C"
          title="Configuración"
          subheader="Tarjeta pulsable"
          className="demo-fixed-width"
          onClick={() => write('clic  tarjeta pulsable')}
        >
          <CardContent>Toda la tarjeta es interactiva.</CardContent>
        </Card>
        <Card className="demo-fixed-width">
          <CardActionArea disabled={areaDisabled} onClick={() => write('clic  área de acción')}>
            <CardMedia height={120} alt="Vista de la ciudad" image={images[image]} />
            <CardContent>Área de acción</CardContent>
          </CardActionArea>
        </Card>
      </div>
      <div className="demo-row">
        <Button
          variant="outlined"
          onClick={() => {
            setCardDisabled(true);
            write('tarjeta disabled={true}');
          }}
        >
          Deshabilitar tarjeta
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setCardDisabled(false);
            write('tarjeta disabled={false}');
          }}
        >
          Habilitar tarjeta
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            cardRef.current?.focus();
            write('cardRef.current.focus()');
          }}
        >
          Enfocar tarjeta
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setAreaDisabled((value) => !value);
            write('disabled del área de acción alternado');
          }}
        >
          Alternar área de acción
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setImage((index) => (index + 1) % images.length);
            write('imagen de CardMedia cambiada');
          }}
        >
          Cambiar imagen
        </Button>
      </div>
      <pre className="demo-log" aria-live="polite">
        {log.join('\n')}
      </pre>
    </div>
  );
}
