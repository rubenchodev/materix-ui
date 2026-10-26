import { Alert } from '@rubenchodev/materix-react/components/alert';
import { Button } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'Actions', es: 'Acciones' };
export const description = {
  en: '`action` places a Button to the right of the message.',
  es: '`action` coloca un Button a la derecha del mensaje.',
};

export default function Demo() {
  return (
    <div className="demo-stack demo-wide">
      <Alert
        severity="success"
        action={
          <Button variant="text" size="small" color="success">
            Deshacer
          </Button>
        }
      >
        Se eliminó 1 conversación.
      </Alert>
      <Alert
        severity="warning"
        variant="outlined"
        title="Almacenamiento casi lleno"
        action={
          <Button variant="text" size="small" color="warning">
            Ampliar
          </Button>
        }
      >
        Has usado el 92 % de tu espacio.
      </Alert>
    </div>
  );
}
