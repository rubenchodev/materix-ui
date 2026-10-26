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
        <span className="demo-label">standard · sin contenedor</span>
        <Tabs aria-label="Estándar">
          <Tab label="Uno" />
          <Tab label="Dos" />
          <Tab label="Tres" />
        </Tabs>
      </div>
      <div className="demo-group">
        <span className="demo-label">variant=&quot;fullWidth&quot;</span>
        <Tabs variant="fullWidth" aria-label="Ancho completo">
          <Tab label="Inventario" />
          <Tab label="Ventas" />
          <Tab label="Clientes" />
        </Tabs>
      </div>
      <div className="demo-group">
        <span className="demo-label">centered</span>
        <Tabs centered defaultValue={1} aria-label="Centradas">
          <Tab label="Ayer" />
          <Tab label="Hoy" />
          <Tab label="Mañana" />
        </Tabs>
      </div>
      <div className="demo-group">
        <span className="demo-label">TabsContainer · TabsContainer borderless</span>
        <div className="demo-grid-2">
          <TabContext defaultValue="a">
            <TabsContainer>
              <Tabs aria-label="Con borde">
                <Tab value="a" label="Con borde" />
                <Tab value="b" label="Otra" />
              </Tabs>
              <TabPanel value="a">Superficie con borde y fondo de papel.</TabPanel>
              <TabPanel value="b">Segundo panel.</TabPanel>
            </TabsContainer>
          </TabContext>
          <TabContext defaultValue="a">
            <TabsContainer borderless>
              <Tabs aria-label="Sin borde">
                <Tab value="a" label="Sin borde" />
                <Tab value="b" label="Otra" />
              </Tabs>
              <TabPanel value="a">Sin borde ni fondo.</TabPanel>
              <TabPanel value="b">Segundo panel.</TabPanel>
            </TabsContainer>
          </TabContext>
        </div>
      </div>
    </div>
  );
}
