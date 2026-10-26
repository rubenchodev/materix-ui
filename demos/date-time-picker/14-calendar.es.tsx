import { useState } from 'react';
import { Paper } from '@rubenchodev/materix-react/components/paper';
import { DateCalendar } from '@rubenchodev/materix-react/components/date-time-picker';
import type { DateRange } from '@rubenchodev/materix-react/components/date-time-picker';

export const title = { en: 'Standalone DateCalendar', es: 'DateCalendar independiente' };
export const description = {
  en: 'The calendar the pickers use, on its own: single or range selection, month and year views, limits and `shouldDisableDate`. Place it in a surface of your own (here an outlined `Paper`).',
  es: 'El calendario que usan los pickers, por separado: selección simple o de rango, vistas de meses y años, límites y `shouldDisableDate`. Colócalo en tu propia superficie (aquí un `Paper` outlined).',
};

const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;

export default function Demo() {
  const [date, setDate] = useState<Date | null>(null);
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <div className="demo-grid-2">
      <div className="demo-stack">
        <Paper variant="outlined" className="mtx-p-2" role="group" aria-label="Calendario de días laborables">
            <DateCalendar value={date} onChange={setDate} shouldDisableDate={isWeekend} />
        </Paper>
        <p className="demo-status" aria-live="polite">
          Solo días laborables · {date ? date.toLocaleDateString('es') : 'ninguna'}
        </p>
      </div>
      <div className="demo-stack">
        <Paper variant="outlined" className="mtx-p-2" role="group" aria-label="Calendario de rango">
            <DateCalendar range rangeValue={range} onRangeChange={setRange} minDate={new Date()} />
        </Paper>
        <p className="demo-status" aria-live="polite">
          Rango · {range.start ? range.start.toLocaleDateString('es') : '…'} – {range.end ? range.end.toLocaleDateString('es') : '…'}
        </p>
      </div>
    </div>
  );
}
