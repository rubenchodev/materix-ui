import { Alert, AlertTitle } from '@rubenchodev/materix-react/components/alert';

export const title = { en: 'Title', es: 'Título' };
export const description = {
  en: '`title` or a first `<AlertTitle>` child renders a bold title above the message.',
  es: '`title` o un primer hijo `<AlertTitle>` genera un título en negrita sobre el mensaje.',
};

export default function Demo() {
  return (
    <div className="demo-stack demo-wide">
      <Alert severity="info" title="Mantenimiento programado">
        El servicio estará en pausa el domingo de 02:00 a 04:00.
      </Alert>
      <Alert severity="warning" variant="outlined" title="Verifica tu correo">
        Confirma tu dirección para seguir recibiendo notificaciones.
      </Alert>
      <Alert severity="error" variant="filled">
        <AlertTitle>Sesión expirada</AlertTitle>
        Vuelve a iniciar sesión para continuar.
      </Alert>
    </div>
  );
}
