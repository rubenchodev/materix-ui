import { NativeSelect } from '@rubenchodev/materix-react/components/native-select';

export const title = { en: 'States', es: 'Estados' };
export const description = {
  en: 'Normal, error (`error`), disabled (`disabled`) and required (`required`, with the asterisk). Use <kbd>Tab</kbd> to see focus: the border and the label switch to the primary color.',
  es: 'Normal, error (`error`), deshabilitado (`disabled`) y obligatorio (`required`, con asterisco). Usa <kbd>Tab</kbd> para ver el foco: el borde y el label pasan al color primario.',
};

const EMPTY_COLOR = [{ value: '', label: 'Sin elegir' }, { value: 'red', label: 'Rojo' }];

export default function Demo() {
  return (
    <div className="demo-grid-3">
      <div className="demo-group">
        <span className="demo-label">Normal</span>
        <NativeSelect variant="outlined" label="Talla" options={[{ value: 's', label: 'S' }, { value: 'm', label: 'M' }]} />
      </div>
      <div className="demo-group">
        <span className="demo-label">Error</span>
        <NativeSelect variant="outlined" label="Talla" error options={[{ value: '', label: 'Sin elegir' }, { value: 'm', label: 'M' }]} />
      </div>
      <div className="demo-group">
        <span className="demo-label">Deshabilitado</span>
        <NativeSelect variant="outlined" label="Plan" disabled options={[{ value: 'pro', label: 'Profesional' }]} />
      </div>
      <div className="demo-group">
        <span className="demo-label">Error filled</span>
        <NativeSelect variant="filled" label="Color" error options={EMPTY_COLOR} />
      </div>
      <div className="demo-group">
        <span className="demo-label">Error standard</span>
        <NativeSelect variant="standard" label="Color" error options={EMPTY_COLOR} />
      </div>
      <div className="demo-group">
        <span className="demo-label">Obligatorio</span>
        <NativeSelect
          variant="filled"
          label="Plan"
          required
          options={[{ value: 'free', label: 'Gratis' }, { value: 'pro', label: 'Profesional' }]}
        />
      </div>
    </div>
  );
}
