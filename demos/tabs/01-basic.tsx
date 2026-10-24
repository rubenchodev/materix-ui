import { Tab, TabContext, TabPanel, Tabs, TabsContainer } from '@rubenchodev/materix-react/components/tabs';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: "`TabContext` shares the active value between `Tabs` and each `TabPanel`: it generates the ids, links `aria-controls`/`aria-labelledby` and hides the inactive panels. Each `Tab` only needs `value` and `label`. `TabsContainer` is optional and groups everything on an outlined surface.",
  es: "`TabContext` comparte el valor activo entre `Tabs` y cada `TabPanel`: genera los ids, enlaza `aria-controls`/`aria-labelledby` y oculta los paneles inactivos. Cada `Tab` solo necesita `value` y `label`. `TabsContainer` es opcional y agrupa todo sobre una superficie con borde.",
};

export default function Demo() {
  return (
    <TabContext defaultValue="overview">
      <TabsContainer>
        <Tabs aria-label="Project">
          <Tab value="overview" label="Overview" />
          <Tab value="activity" label="Activity" />
          <Tab value="settings" label="Settings" />
        </Tabs>
        <TabPanel value="overview">Project overview: 12 open tasks and 3 pending reviews.</TabPanel>
        <TabPanel value="activity">Last activity 5 minutes ago.</TabPanel>
        <TabPanel value="settings">Project preferences.</TabPanel>
      </TabsContainer>
    </TabContext>
  );
}
