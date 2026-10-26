import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Stack } from '@rubenchodev/materix-react/components/stack';
import { Tab, TabContext, TabPanel, Tabs, TabsContainer } from '@rubenchodev/materix-react/components/tabs';
import type { TabValue } from '@rubenchodev/materix-react/components/tabs';

export const title = { en: 'Controlled usage and cancelable change', es: 'Uso controlado y cambio cancelable' };

export const description = {
  en: "`TabContext` is controlled with `value` + `onChange`, so external buttons can change the tab. `onBeforeChange(value, previousValue)` runs first: returning `false` cancels the change (here, the \"Locked\" tab), like the cancelable `mtx:tabs:before-change` in vanilla.",
  es: "`TabContext` se controla con `value` + `onChange`, así que unos botones externos pueden cambiar de pestaña. `onBeforeChange(value, previousValue)` se ejecuta antes: si devuelve `false`, cancela el cambio (aquí, la pestaña \"Locked\"), como el cancelable `mtx:tabs:before-change` de vanilla.",
};

export default function Demo() {
  const [value, setValue] = useState<TabValue>('general');
  const [log, setLog] = useState<string[]>([]);
  const write = (message: string) => setLog((prev) => [message, ...prev].slice(0, 12));

  return (
    <div className="demo-stack">
      <TabContext value={value} onChange={(_, next) => setValue(next)}>
        <TabsContainer>
          <Tabs
            aria-label="Ajustes"
            onBeforeChange={(next, previous) => {
              if (next === 'locked') {
                write(`onBeforeChange(${next}, ${previous}) → false: cambio cancelado`);
                return false;
              }
              return true;
            }}
            onChange={(_, next) => write(`onChange → ${next}`)}
          >
            <Tab value="general" label="General" />
            <Tab value="advanced" label="Avanzado" />
            <Tab value="locked" label="Bloqueado" />
          </Tabs>
          <TabPanel value="general">Ajustes generales.</TabPanel>
          <TabPanel value="advanced">Ajustes avanzados.</TabPanel>
          <TabPanel value="locked">Nunca debería verse.</TabPanel>
        </TabsContainer>
      </TabContext>
      <Stack direction="row" spacing={1} wrap alignItems="center">
        <Button variant="outlined" size="small" onClick={() => setValue('general')}>
          value = &apos;general&apos;
        </Button>
        <Button variant="outlined" size="small" onClick={() => setValue('advanced')}>
          value = &apos;advanced&apos;
        </Button>
        <span className="demo-status">value: {String(value)}</span>
      </Stack>
      <pre className="demo-log" aria-live="polite">
        {log.join('\n')}
      </pre>
    </div>
  );
}
