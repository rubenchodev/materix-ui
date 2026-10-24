/** Página de ejemplo de DateTimePicker: monta todas las demos de demos/date-time-picker. */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob('../../demos/date-time-picker/*.tsx', { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage slug="date-time-picker" title="Date Time Picker"
      description="Date, time, date-time and range pickers with a calendar, MD2 radial clock, popover, modal or static mode, limits and formats."
      demos={demos} />
  </StrictMode>,
);
