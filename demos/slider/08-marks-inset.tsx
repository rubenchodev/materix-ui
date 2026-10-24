import { Card, CardContent } from '@rubenchodev/materix-react/components/card';
import { Container } from '@rubenchodev/materix-react/components/container';
import { Slider } from '@rubenchodev/materix-react/components/slider';

export const title = { en: 'Edge mark labels', es: 'Etiquetas de marcas en los extremos' };
export const description = {
  en: "Edge labels are centered on their mark and overflow the rail. In narrow containers marksInset aligns the first label to the start and the last one to the end.",
  es: "Las etiquetas de los extremos se centran sobre su marca y sobresalen del rail. En contenedores estrechos marksInset alinea la primera al inicio y la última al final.",
};

const TEMPERATURES = '0:0 °C,20:20 °C,37:37 °C,100:100 °C';

export default function Demo() {
  return (
    <Container maxWidth="xs" disableGutters>
      <Card variant="outlined">
        <CardContent>
          <div className="demo-stack">
            <Slider aria-label="Temperature, centered edge labels" marks={TEMPERATURES} defaultValue={37} />
            <Slider aria-label="Temperature, inset edge labels" marks={TEMPERATURES} marksInset defaultValue={37} />
            <Slider
              aria-label="Quality"
              min={1}
              max={3}
              step={null}
              marks={[
                { value: 1, label: 'Minimum' },
                { value: 2, label: 'Medium' },
                { value: 3, label: 'Maximum' },
              ]}
              marksInset
              defaultValue={2}
            />
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
