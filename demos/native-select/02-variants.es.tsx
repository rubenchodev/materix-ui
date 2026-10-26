import { NativeSelect } from '@rubenchodev/materix-react/components/native-select';

export const title = { en: 'Variants', es: 'Variantes' };
export const description = {
  en: '`standard` (default), `outlined` and `filled` through `variant`, with the same proportions as TextField and Select.',
  es: '`standard` (predeterminada), `outlined` y `filled` con `variant`, con las mismas proporciones que TextField y Select.',
};

const COUNTRIES = [
  { value: 'co', label: 'Colombia' },
  { value: 'mx', label: 'México' },
  { value: 'es', label: 'España' },
];

export default function Demo() {
  return (
    <div className="demo-grid-3">
      {(['outlined', 'filled', 'standard'] as const).map((variant) => (
        <div key={variant} className="demo-group">
          <span className="demo-label">{variant}</span>
          <NativeSelect variant={variant} label="País" options={COUNTRIES} />
        </div>
      ))}
    </div>
  );
}
