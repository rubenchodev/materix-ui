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
        <Tabs variant="fullWidth" aria-label="Account settings">
          <Tab value="profile" icon="person" label="Profile" />
          <Tab value="security" icon="lock" label="Security" />
          <Tab value="alerts" icon="notifications" label="Alerts" />
        </Tabs>
        <TabPanel value="profile">
          <Stack spacing={1}>
            <Checkbox label="Show my profile publicly" defaultChecked />
            <Checkbox label="Show my email address" />
          </Stack>
        </TabPanel>
        <TabPanel value="security">
          <Stack spacing={1}>
            <Switch label="Two-step verification" defaultChecked />
            <Switch label="Sign-in alerts" />
          </Stack>
        </TabPanel>
        <TabPanel value="alerts">
          <Stack spacing={1}>
            <Switch label="Weekly email digest" defaultChecked />
            <Switch label="Push notifications" />
          </Stack>
        </TabPanel>
      </TabsContainer>
    </TabContext>
  );
}
