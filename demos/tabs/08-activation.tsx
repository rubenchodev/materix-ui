import { Tab, TabContext, TabPanel, Tabs, TabsContainer } from '@rubenchodev/materix-react/components/tabs';

export const title = { en: 'Manual and automatic activation', es: 'Activación manual y automática' };
export const description = {
  en: "By default the arrow keys only move focus and Enter or Space activate the tab (manual activation, recommended when a panel is expensive to load). With `selectionFollowsFocus` the tab is activated as soon as it receives focus.",
  es: "Por defecto las flechas solo mueven el foco y Enter o Espacio activan la pestaña (activación manual, recomendada cuando cargar un panel es costoso). Con `selectionFollowsFocus` la pestaña se activa en cuanto recibe el foco.",
};

function Group({ follows }: { follows: boolean }) {
  return (
    <TabContext defaultValue="day">
      <TabsContainer>
        <Tabs selectionFollowsFocus={follows} aria-label={follows ? 'Automatic activation' : 'Manual activation'}>
          <Tab value="day" label="Day" />
          <Tab value="week" label="Week" />
          <Tab value="month" label="Month" />
        </Tabs>
        <TabPanel value="day">Daily view.</TabPanel>
        <TabPanel value="week">Weekly view.</TabPanel>
        <TabPanel value="month">Monthly view.</TabPanel>
      </TabsContainer>
    </TabContext>
  );
}

export default function Demo() {
  return (
    <div className="demo-grid-2">
      <div className="demo-group">
        <span className="demo-label">Manual · arrows move focus, Enter/Space activate</span>
        <Group follows={false} />
      </div>
      <div className="demo-group">
        <span className="demo-label">selectionFollowsFocus · arrows activate</span>
        <Group follows />
      </div>
    </div>
  );
}
