import { DatePicker, DateTimePicker } from '@rubenchodev/materix-react/components/date-time-picker';

export const title = { en: 'Language and texts', es: 'Idioma y textos' };
export const description = {
  en: "`locale` sets a field's language and accepts regions (`es-MX` uses the `es` texts); without it, the locale of the `I18nProvider` (or `<html lang>`) is used. Months and days come from the i18n dictionary, or from `Intl` if the language is not registered, and the default format follows the locale order. `todayText`, `cancelText` and `okText` replace the button texts; `actions` adds a Clear button.",
  es: '`locale` fija el idioma de un campo y admite regiones (`es-MX` usa los textos de `es`); sin él se usa el locale del `I18nProvider` (o `<html lang>`). Meses y días salen del diccionario i18n, o de `Intl` si el idioma no está registrado, y el formato por defecto sigue el orden del locale. `todayText`, `cancelText` y `okText` sustituyen los textos de los botones; `actions` añade un botón Borrar.',
};

export default function Demo() {
  return (
    <div className="demo-grid-3">
      <div className="demo-group">
        <span className="demo-label">locale="es-MX" · DD/MM/YYYY</span>
        <DatePicker label="Fecha de factura" locale="es-MX" defaultValue="2026-10-20" />
      </div>
      <div className="demo-group">
        <span className="demo-label">locale="en-US" · MM/DD/YYYY</span>
        <DateTimePicker label="Meeting" locale="en-US" defaultValue="2026-10-20 14:30" />
      </div>
      <div className="demo-group">
        <span className="demo-label">locale="fr-FR" · Intl</span>
        <DatePicker label="Date" locale="fr-FR" defaultValue="2026-10-20" />
      </div>
      <div className="demo-group">
        <span className="demo-label">locale="es"</span>
        <DatePicker label="Fecha" locale="es" />
      </div>
      <div className="demo-group">
        <span className="demo-label">locale="en"</span>
        <DatePicker label="Date" locale="en" />
      </div>
      <div className="demo-group">
        <span className="demo-label">Textos personalizados + Clear</span>
        <DatePicker
          label="Fecha"
          todayText="Ahora"
          cancelText="Volver"
          okText="Listo"
          clearText="Restablecer"
          actions={['today', 'clear', 'cancel', 'accept']}
        />
      </div>
      <div className="demo-group">
        <span className="demo-label">DateTimePicker + mode="date"</span>
        <DateTimePicker mode="date" label="Solo fecha" />
      </div>
      <div className="demo-group">
        <span className="demo-label">DateTimePicker + mode="time"</span>
        <DateTimePicker mode="time" label="Solo hora" />
      </div>
    </div>
  );
}
