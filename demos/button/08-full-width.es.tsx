import { Button } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'Full width', es: 'Ancho completo' };
export const description = {
  en: "`fullWidth` takes 100% of the container (MUI's `fullWidth`). Useful in narrow forms and on mobile.",
  es: "`fullWidth` ocupa el 100% del contenedor (el `fullWidth` de MUI). Útil en formularios estrechos y en móvil.",
};

export default function Demo() {
  return (
    <div className="demo-stack demo-fixed-width">
      <Button variant="contained" size="large" fullWidth>Iniciar sesión</Button>
      <Button variant="outlined" size="large" fullWidth>Crear cuenta</Button>
    </div>
  );
}
