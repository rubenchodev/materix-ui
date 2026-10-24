import { NativeSelect } from '@rubenchodev/materix-react/components/native-select';

export const title = { en: 'Groups and multiple selection', es: 'Grupos y selección múltiple' };
export const description = {
  en: '`<optgroup>` and `<option disabled>` work natively, as children or through `options`. With `multiple` and `htmlSize` the browser list box is shown with its variant border or background and no chevron (use Ctrl/Cmd + click).',
  es: '`<optgroup>` y `<option disabled>` funcionan de forma nativa, como children o con `options`. Con `multiple` y `htmlSize` se muestra la lista del navegador con el borde o fondo de su variante y sin chevron (usa Ctrl/Cmd + clic).',
};

const LANGUAGES = [
  { value: 'js', label: 'JavaScript' },
  { value: 'ts', label: 'TypeScript' },
  { value: 'py', label: 'Python' },
  { value: 'go', label: 'Go' },
];

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">Option groups (children)</span>
        <div className="demo-fixed-width">
          <NativeSelect variant="filled" label="City">
            <optgroup label="Colombia">
              <option value="bog">Bogotá</option>
              <option value="med">Medellín</option>
            </optgroup>
            <optgroup label="Mexico">
              <option value="cdmx">Mexico City</option>
              <option value="gdl" disabled>Guadalajara (no coverage)</option>
            </optgroup>
          </NativeSelect>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Option groups (options prop)</span>
        <div className="demo-fixed-width">
          <NativeSelect
            variant="outlined"
            label="Team"
            options={[
              { label: 'Engineering', options: [{ value: 'fe', label: 'Frontend' }, { value: 'be', label: 'Backend' }] },
              { label: 'Design', options: [{ value: 'ux', label: 'UX' }, { value: 'ui', label: 'UI', disabled: true }] },
            ]}
          />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Multiple · outlined, filled and standard</span>
        <div className="demo-grid-3">
          <NativeSelect variant="outlined" label="Languages" multiple htmlSize={4} defaultValue={['js']} options={LANGUAGES} />
          <NativeSelect variant="filled" label="Languages" multiple htmlSize={4} defaultValue={['ts']} options={LANGUAGES} />
          <NativeSelect label="Languages" multiple htmlSize={4} defaultValue={['py']} options={LANGUAGES} />
        </div>
      </div>
    </div>
  );
}
