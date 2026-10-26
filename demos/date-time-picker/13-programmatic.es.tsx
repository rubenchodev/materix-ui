import { useRef, useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { DateRangePicker, DateTimePicker } from '@rubenchodev/materix-react/components/date-time-picker';
import type {
  DateRange,
  DateTimePickerActions,
  DateTimePickerValue,
} from '@rubenchodev/materix-react/components/date-time-picker';

export const title = { en: 'Programmatic usage', es: 'Uso programático' };
export const description = {
  en: 'Controlled `value`/`onChange` and `onOpen`/`onClose`, plus the `action` ref (`open()`, `close()`, `toggle()`, `clear()`). The log shows the callbacks equivalent to `mtx:date-time-picker:open`, `:close` and `:change` (a single call per selection).',
  es: '`value`/`onChange` controlados y `onOpen`/`onClose`, más la ref `action` (`open()`, `close()`, `toggle()`, `clear()`). El registro muestra los callbacks equivalentes a `mtx:date-time-picker:open`, `:close` y `:change` (una sola llamada por selección).',
};

export default function Demo() {
  const action = useRef<DateTimePickerActions>(null);
  const [value, setValue] = useState<Date | null>(null);
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [log, setLog] = useState<string[]>([]);
  const write = (message: string) =>
    setLog((prev) => [`${new Date().toLocaleTimeString()}  ${message}`, ...prev].slice(0, 20));

  const actions: Array<[string, () => void]> = [
    ['open()', () => action.current?.open()],
    ["value = '2026-12-25 20:00'", () => setValue(new Date(2026, 11, 25, 20, 0))],
    ['value = new Date()', () => setValue(new Date())],
    [
      "time = '09:15'",
      () =>
        setValue((prev) => {
          const base = prev ? new Date(prev) : new Date();
          base.setHours(9, 15, 0, 0);
          return base;
        }),
    ],
    ['leer valor', () => write(`value ${value ? value.toString() : 'null'} · iso ${value ? value.toISOString() : 'null'}`)],
    ["range = ['2026-10-01', '2026-10-15']", () => setRange({ start: new Date(2026, 9, 1), end: new Date(2026, 9, 15) })],
    ['leer rango', () => write(`range ${JSON.stringify(range)}`)],
    [
      'clear()',
      () => {
        action.current?.clear();
        setRange({ start: null, end: null });
      },
    ],
  ];

  return (
    <div className="demo-stack">
      <div className="demo-grid-2">
        <div className="demo-group">
          <span className="demo-label">Fecha y hora</span>
          <DateTimePicker
            label="Entrega"
            action={action}
            value={value}
            onChange={(next: DateTimePickerValue, detail) => {
              setValue(next instanceof Date ? next : null);
              write(`onChange → value "${detail.value}" · iso ${detail.iso}`);
            }}
            onAccept={(_, detail) => write(`onAccept → "${detail.value}"`)}
            onOpen={() => write('onOpen')}
            onClose={(reason) => write(`onClose (${reason})`)}
          />
        </div>
        <div className="demo-group">
          <span className="demo-label">Rango</span>
          <DateRangePicker
            label="Periodo"
            value={range}
            onChange={(next, detail) => {
              setRange(next as DateRange);
              write(`onChange (range) → "${detail.value}"`);
            }}
          />
        </div>
      </div>
      <div className="demo-row">
        {actions.map(([label, run]) => (
          <Button key={label} variant="outlined" size="small" onClick={run}>
            {label}
          </Button>
        ))}
      </div>
      <pre className="demo-log" aria-live="polite">
        {log.join('\n')}
      </pre>
    </div>
  );
}
