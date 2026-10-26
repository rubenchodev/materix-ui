import { Alert } from '@rubenchodev/materix-react/components/alert';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: '`<Alert severity>` renders the severity icon, the message container and, with `title`, the title.',
  es: '`<Alert severity>` genera el icono de la severidad, el contenedor del mensaje y, con `title`, el título.',
};

export default function Demo() {
  return (
    <div className="demo-stack demo-wide">
      <Alert severity="success">Los cambios se guardaron correctamente.</Alert>
      <Alert severity="error" title="Error">
        No se pudo conectar con el servidor.
      </Alert>
    </div>
  );
}
