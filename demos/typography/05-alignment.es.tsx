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
        Alineado a la izquierda
      </Typography>
      <Typography align="center" className="demo-wide">
        Centrado
      </Typography>
      <Typography align="right" className="demo-wide">
        Alineado a la derecha
      </Typography>
      <Typography variant="body2" align="justify" className="demo-wide">
        Texto justificado: las líneas completas se reparten en el ancho del contenedor para que ambos márgenes queden
        alineados, algo útil en bloques de lectura largos.
      </Typography>
    </div>
  );
}
