import { Grid } from '@rubenchodev/materix-react/components/grid';
import { Tab, TabContext, TabPanel, Tabs, TabsContainer } from '@rubenchodev/materix-react/components/tabs';

export const title = { en: 'Grid layout', es: 'Maquetación en grilla' };
export const description = {
  en: "Two independent groups inside a `Grid`: one column on mobile and two from 900px. The indicator is recalculated whenever the width changes.",
  es: "Dos grupos independientes dentro de un `Grid`: una columna en móvil y dos desde 900px. El indicador se recalcula cada vez que cambia el ancho.",
};

export default function Demo() {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <TabContext defaultValue="sales">
          <TabsContainer>
            <Tabs variant="fullWidth" aria-label="Finance">
              <Tab value="sales" label="Sales" />
              <Tab value="expenses" label="Expenses" />
            </Tabs>
            <TabPanel value="sales">Sales this month: $24,300.</TabPanel>
            <TabPanel value="expenses">Expenses this month: $9,120.</TabPanel>
          </TabsContainer>
        </TabContext>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TabContext defaultValue="inbox">
          <TabsContainer>
            <Tabs variant="fullWidth" aria-label="Mail">
              <Tab value="inbox" icon="inbox" label="Inbox" />
              <Tab value="sent" icon="send" label="Sent" />
            </Tabs>
            <TabPanel value="inbox">4 unread messages.</TabPanel>
            <TabPanel value="sent">Last sent: yesterday.</TabPanel>
          </TabsContainer>
        </TabContext>
      </Grid>
    </Grid>
  );
}
