import { useState } from 'react';
import { TextField } from '@rubenchodev/materix-react/components/text-field';

export const title = { en: 'Interactive adornments', es: 'Adornos interactivos' };
export const description = {
  en: 'The equivalent of `InputAdornment` + `IconButton` in MUI. `passwordToggle` (only with `type="password"`) adds the show/hide button with `aria-pressed` and a translated name; `startAction` and `endAction` create an IconButton with the given icon and call `onAdornmentClick`. The icon sits in the same position as a static icon, so the label stays aligned.',
  es: 'El equivalente a `InputAdornment` + `IconButton` de MUI. `passwordToggle` (solo con `type="password"`) añade el botón mostrar/ocultar con `aria-pressed` y nombre traducido; `startAction` y `endAction` crean un IconButton con el icono indicado y llaman a `onAdornmentClick`. El icono ocupa la misma posición que un icono estático, así que el label sigue alineado.',
};

export default function Demo() {
  const [search, setSearch] = useState('Materix');
  const [location, setLocation] = useState('');
  const [log, setLog] = useState<string[]>([]);
  const write = (text: string) => setLog((prev) => [`${new Date().toLocaleTimeString()}  ${text}`, ...prev].slice(0, 6));
  const onVisibility = (visible: boolean) => write(`onPasswordVisibilityChange → visible: ${visible}`);

  return (
    <div className="demo-stack">
      <div className="demo-grid-3">
        <div className="demo-group">
          <span className="demo-label">Contraseña · outlined</span>
          <TextField
            label="Contraseña"
            type="password"
            passwordToggle
            autoComplete="new-password"
            helperText="Al menos 8 caracteres"
            onPasswordVisibilityChange={onVisibility}
          />
        </div>
        <div className="demo-group">
          <span className="demo-label">Contraseña · filled + icono inicial</span>
          <TextField
            label="Contraseña"
            variant="filled"
            startIcon="lock"
            type="password"
            passwordToggle
            autoComplete="new-password"
            onPasswordVisibilityChange={onVisibility}
          />
        </div>
        <div className="demo-group">
          <span className="demo-label">Contraseña · small + contador</span>
          <TextField
            label="PIN"
            size="small"
            type="password"
            passwordToggle
            maxLength={6}
            inputMode="numeric"
            autoComplete="off"
            onPasswordVisibilityChange={onVisibility}
          />
        </div>
        <div className="demo-group">
          <span className="demo-label">Acción final · limpiar</span>
          <TextField
            label="Buscar"
            startIcon="search"
            endAction="close"
            endActionLabel="Limpiar búsqueda"
            type="search"
            value={search}
            onChange={(_, next) => setSearch(next)}
            onAdornmentClick={({ input }) => {
              setSearch('');
              input?.focus();
              write('onAdornmentClick (end) → campo limpiado');
            }}
          />
        </div>
        <div className="demo-group">
          <span className="demo-label">Acción inicial · standard</span>
          <TextField
            label="Ubicación"
            variant="standard"
            startAction="my_location"
            startActionLabel="Usar mi ubicación"
            value={location}
            onChange={(_, next) => setLocation(next)}
            onAdornmentClick={() => {
              setLocation('Ciudad de México, CDMX');
              write('onAdornmentClick (start) → ubicación aproximada');
            }}
          />
        </div>
        <div className="demo-group">
          <span className="demo-label">Deshabilitado</span>
          <TextField label="Contraseña" type="password" passwordToggle defaultValue="secreto" disabled />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Registro de eventos</span>
        <pre className="demo-log" aria-live="polite">
          {log.join('\n')}
        </pre>
      </div>
    </div>
  );
}
