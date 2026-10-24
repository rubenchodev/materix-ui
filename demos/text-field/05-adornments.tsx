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
          <span className="demo-label">Password · outlined</span>
          <TextField
            label="Password"
            type="password"
            passwordToggle
            autoComplete="new-password"
            helperText="At least 8 characters"
            onPasswordVisibilityChange={onVisibility}
          />
        </div>
        <div className="demo-group">
          <span className="demo-label">Password · filled + start icon</span>
          <TextField
            label="Password"
            variant="filled"
            startIcon="lock"
            type="password"
            passwordToggle
            autoComplete="new-password"
            onPasswordVisibilityChange={onVisibility}
          />
        </div>
        <div className="demo-group">
          <span className="demo-label">Password · small + counter</span>
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
          <span className="demo-label">End action · clear</span>
          <TextField
            label="Search"
            startIcon="search"
            endAction="close"
            endActionLabel="Clear search"
            type="search"
            value={search}
            onChange={(_, next) => setSearch(next)}
            onAdornmentClick={({ input }) => {
              setSearch('');
              input?.focus();
              write('onAdornmentClick (end) → field cleared');
            }}
          />
        </div>
        <div className="demo-group">
          <span className="demo-label">Start action · standard</span>
          <TextField
            label="Location"
            variant="standard"
            startAction="my_location"
            startActionLabel="Use my location"
            value={location}
            onChange={(_, next) => setLocation(next)}
            onAdornmentClick={() => {
              setLocation('Seattle, WA');
              write('onAdornmentClick (start) → approximate location');
            }}
          />
        </div>
        <div className="demo-group">
          <span className="demo-label">Disabled</span>
          <TextField label="Password" type="password" passwordToggle defaultValue="secret" disabled />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Event log</span>
        <pre className="demo-log" aria-live="polite">
          {log.join('\n')}
        </pre>
      </div>
    </div>
  );
}
