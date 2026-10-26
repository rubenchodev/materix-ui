import { Stack } from '@rubenchodev/materix-react/components/stack';
import { Tab, TabContext, TabPanel, Tabs, TabsContainer } from '@rubenchodev/materix-react/components/tabs';

export const title = { en: 'Vertical', es: 'Vertical' };
export const description = {
  en: "`orientation=\"vertical\"` stacks the tabs, moves the indicator to the right edge and switches navigation to the up/down arrows. A row `Stack` places the panels next to the bar.",
  es: "`orientation=\"vertical\"` apila las pestañas, lleva el indicador al borde derecho y cambia la navegación a las flechas arriba/abajo. Un `Stack` en fila coloca los paneles junto a la barra.",
};

export default function Demo() {
  return (
    <TabContext defaultValue="account">
      <TabsContainer className="demo-wide">
        <Stack direction="row">
          <Tabs orientation="vertical" aria-label="Settings">
            <Tab value="account" icon="person" label="Account" />
            <Tab value="security" icon="lock" label="Security" />
            <Tab value="notifications" icon="notifications" label="Notifications" />
            <Tab value="billing" icon="credit_card" label="Billing" disabled />
          </Tabs>
          <TabPanel value="account">Account details and contact email.</TabPanel>
          <TabPanel value="security">Password and two-step verification.</TabPanel>
          <TabPanel value="notifications">Email, push and weekly digest.</TabPanel>
          <TabPanel value="billing">Not available.</TabPanel>
        </Stack>
      </TabsContainer>
    </TabContext>
  );
}
