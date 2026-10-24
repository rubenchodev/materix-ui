import { Alert } from '@rubenchodev/materix-react/components/alert';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: '`<Alert severity>` renders the severity icon, the message container and, with `title`, the title.',
  es: '`<Alert severity>` genera el icono de la severidad, el contenedor del mensaje y, con `title`, el título.',
};

export default function Demo() {
  return (
    <div className="demo-stack demo-wide">
      <Alert severity="success">Your changes were saved successfully.</Alert>
      <Alert severity="error" title="Error">
        Could not connect to the server.
      </Alert>
    </div>
  );
}
