import { Alert, AlertTitle } from '@rubenchodev/materix-react/components/alert';

export const title = { en: 'Title', es: 'Título' };
export const description = {
  en: '`title` or a first `<AlertTitle>` child renders a bold title above the message.',
  es: '`title` o un primer hijo `<AlertTitle>` genera un título en negrita sobre el mensaje.',
};

export default function Demo() {
  return (
    <div className="demo-stack demo-wide">
      <Alert severity="info" title="Scheduled maintenance">
        The service will be paused on Sunday from 2:00 to 4:00 AM.
      </Alert>
      <Alert severity="warning" variant="outlined" title="Verify your email">
        Confirm your address to keep receiving notifications.
      </Alert>
      <Alert severity="error" variant="filled">
        <AlertTitle>Session expired</AlertTitle>
        Sign in again to continue.
      </Alert>
    </div>
  );
}
