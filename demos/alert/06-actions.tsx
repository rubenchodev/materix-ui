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
            Undo
          </Button>
        }
      >
        1 conversation was deleted.
      </Alert>
      <Alert
        severity="warning"
        variant="outlined"
        title="Storage almost full"
        action={
          <Button variant="text" size="small" color="warning">
            Upgrade
          </Button>
        }
      >
        You have used 92% of your space.
      </Alert>
    </div>
  );
}
