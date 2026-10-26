import { Checkbox } from '@rubenchodev/materix-react/components/checkbox';
import { Stack } from '@rubenchodev/materix-react/components/stack';
import { Switch } from '@rubenchodev/materix-react/components/switch';
import { Tab, TabContext, TabPanel, Tabs, TabsContainer } from '@rubenchodev/materix-react/components/tabs';

export const title = { en: 'Real-world example', es: 'Ejemplo real' };
export const description = {
  en: "Account settings with full-width tabs, icons and panels that hold real form controls (Checkbox and Switch).",
  es: "Ajustes de cuenta con pestañas a todo el ancho, iconos y paneles con controles de formulario reales (Checkbox y Switch).",
};

export default function Demo() {
  return (
    <TabContext defaultValue="profile">
      <TabsContainer className="demo-wide">
        <Tabs variant="fullWidth" aria-label="Ajustes de cuenta">
          <Tab value="profile" icon="person" label="Perfil" />
          <Tab value="security" icon="lock" label="Seguridad" />
          <Tab value="alerts" icon="notifications" label="Alertas" />
        </Tabs>
        <TabPanel value="profile">
          <Stack spacing={1}>
            <Checkbox label="Mostrar mi perfil públicamente" defaultChecked />
            <Checkbox label="Mostrar mi dirección de correo" />
          </Stack>
        </TabPanel>
        <TabPanel value="security">
          <Stack spacing={1}>
            <Switch label="Verificación en dos pasos" defaultChecked />
            <Switch label="Alertas de inicio de sesión" />
          </Stack>
        </TabPanel>
        <TabPanel value="alerts">
          <Stack spacing={1}>
            <Switch label="Resumen semanal por correo" defaultChecked />
            <Switch label="Notificaciones push" />
          </Stack>
        </TabPanel>
      </TabsContainer>
    </TabContext>
  );
}
