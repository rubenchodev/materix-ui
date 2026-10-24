import { Tab, TabContext, TabPanel, Tabs, TabsContainer } from '@rubenchodev/materix-react/components/tabs';

export const title = { en: 'Variants', es: 'Variantes' };
export const description = {
  en: "By default tabs keep their natural width (`variant=\"standard\"`). `variant=\"fullWidth\"` spreads them across the bar and `centered` centers them. A `Tab` without `value` gets its index. `TabsContainer` adds a bordered surface; with `borderless` it only groups.",
  es: "Por defecto las pestañas conservan su ancho natural (`variant=\"standard\"`). `variant=\"fullWidth\"` las reparte en la barra y `centered` las centra. Un `Tab` sin `value` recibe su índice. `TabsContainer` añade una superficie con borde; con `borderless` solo agrupa.",
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">standard · no container</span>
        <Tabs aria-label="Standard">
          <Tab label="One" />
          <Tab label="Two" />
          <Tab label="Three" />
        </Tabs>
      </div>
      <div className="demo-group">
        <span className="demo-label">variant=&quot;fullWidth&quot;</span>
        <Tabs variant="fullWidth" aria-label="Full width">
          <Tab label="Inventory" />
          <Tab label="Sales" />
          <Tab label="Customers" />
        </Tabs>
      </div>
      <div className="demo-group">
        <span className="demo-label">centered</span>
        <Tabs centered defaultValue={1} aria-label="Centered">
          <Tab label="Yesterday" />
          <Tab label="Today" />
          <Tab label="Tomorrow" />
        </Tabs>
      </div>
      <div className="demo-group">
        <span className="demo-label">TabsContainer · TabsContainer borderless</span>
        <div className="demo-grid-2">
          <TabContext defaultValue="a">
            <TabsContainer>
              <Tabs aria-label="Bordered">
                <Tab value="a" label="Bordered" />
                <Tab value="b" label="Other" />
              </Tabs>
              <TabPanel value="a">Surface with a border and paper background.</TabPanel>
              <TabPanel value="b">Second panel.</TabPanel>
            </TabsContainer>
          </TabContext>
          <TabContext defaultValue="a">
            <TabsContainer borderless>
              <Tabs aria-label="Borderless">
                <Tab value="a" label="Borderless" />
                <Tab value="b" label="Other" />
              </Tabs>
              <TabPanel value="a">No border or background.</TabPanel>
              <TabPanel value="b">Second panel.</TabPanel>
            </TabsContainer>
          </TabContext>
        </div>
      </div>
    </div>
  );
}
