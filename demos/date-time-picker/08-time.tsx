import { DateTimePicker, TimePicker } from '@rubenchodev/materix-react/components/date-time-picker';

export const title = { en: 'Clock and 12-hour format', es: 'Reloj y formato de 12 horas' };
export const description = {
  en: 'Time opens in keyboard mode (editable cards with ↑/↓); `timeView="dial"` opens the MD2 radial clock and the bottom-left button toggles between both. `ampm` or a format with `hh`/`A` turns on AM/PM.',
  es: 'La hora se abre en modo teclado (tarjetas editables con ↑/↓); `timeView="dial"` abre el reloj radial MD2 y el botón inferior izquierdo alterna entre ambos. `ampm` o un formato con `hh`/`A` activa AM/PM.',
};

export default function Demo() {
  return (
    <div className="demo-grid-4">
      <div className="demo-group">
        <span className="demo-label">Keyboard · 24 h</span>
        <TimePicker label="Time" />
      </div>
      <div className="demo-group">
        <span className="demo-label">Keyboard · 12 h</span>
        <TimePicker label="Time" ampm />
      </div>
      <div className="demo-group">
        <span className="demo-label">Clock · 24 h</span>
        <TimePicker label="Time" timeView="dial" />
      </div>
      <div className="demo-group">
        <span className="demo-label">Clock · 12 h</span>
        <DateTimePicker label="Appointment" timeView="dial" format="MM/DD/YYYY hh:mm A" />
      </div>
    </div>
  );
}
