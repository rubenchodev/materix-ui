import { NativeSelect } from '@rubenchodev/materix-react/components/native-select';

export const title = { en: 'States', es: 'Estados' };
export const description = {
  en: 'Normal, error (`error`), disabled (`disabled`) and required (`required`, with the asterisk). Use <kbd>Tab</kbd> to see focus: the border and the label switch to the primary color.',
  es: 'Normal, error (`error`), deshabilitado (`disabled`) y obligatorio (`required`, con asterisco). Usa <kbd>Tab</kbd> para ver el foco: el borde y el label pasan al color primario.',
};

const EMPTY_COLOR = [{ value: '', label: 'Not chosen' }, { value: 'red', label: 'Red' }];

export default function Demo() {
  return (
    <div className="demo-grid-3">
      <div className="demo-group">
        <span className="demo-label">Normal</span>
        <NativeSelect variant="outlined" label="Size" options={[{ value: 's', label: 'S' }, { value: 'm', label: 'M' }]} />
      </div>
      <div className="demo-group">
        <span className="demo-label">Error</span>
        <NativeSelect variant="outlined" label="Size" error options={[{ value: '', label: 'Not chosen' }, { value: 'm', label: 'M' }]} />
      </div>
      <div className="demo-group">
        <span className="demo-label">Disabled</span>
        <NativeSelect variant="outlined" label="Plan" disabled options={[{ value: 'pro', label: 'Professional' }]} />
      </div>
      <div className="demo-group">
        <span className="demo-label">Filled error</span>
        <NativeSelect variant="filled" label="Color" error options={EMPTY_COLOR} />
      </div>
      <div className="demo-group">
        <span className="demo-label">Standard error</span>
        <NativeSelect variant="standard" label="Color" error options={EMPTY_COLOR} />
      </div>
      <div className="demo-group">
        <span className="demo-label">Required</span>
        <NativeSelect
          variant="filled"
          label="Plan"
          required
          options={[{ value: 'free', label: 'Free' }, { value: 'pro', label: 'Professional' }]}
        />
      </div>
    </div>
  );
}
