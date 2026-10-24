import { Autocomplete } from '@rubenchodev/materix-react/components/autocomplete';
import { COUNTRIES } from './data';

export const title = { en: 'Behavior and keyboard', es: 'Comportamiento y teclado' };
export const description = {
  en: '↓/↑ open and move, Page Up/Page Down jump 5, Home/End go to the ends, Enter selects, Escape closes. Options: `autoHighlight`, `autoSelect` (Tab/blur accepts the active one), `clearOnEscape`, `openOnFocus`, `disableClearable`, `matchFrom="start"` and `includeInputInList`.',
  es: '↓/↑ abren y se mueven, Re Pág/Av Pág saltan 5, Inicio/Fin van a los extremos, Enter selecciona, Escape cierra. Opciones: `autoHighlight`, `autoSelect` (Tab/pérdida de foco acepta la activa), `clearOnEscape`, `openOnFocus`, `disableClearable`, `matchFrom="start"` e `includeInputInList`.',
};

export default function Demo() {
  return (
    <div className="demo-grid-3">
      <Autocomplete label="autoHighlight + autoSelect" autoHighlight autoSelect options={COUNTRIES} />
      <Autocomplete label="clearOnEscape" clearOnEscape options={COUNTRIES} defaultValue="uy" />
      <Autocomplete label="openOnFocus" openOnFocus options={COUNTRIES} />
      <Autocomplete label="disableClearable" disableClearable options={COUNTRIES} defaultValue="ec" />
      <Autocomplete label="matchFrom start" matchFrom="start" options={COUNTRIES} />
      <Autocomplete label="includeInputInList" includeInputInList options={COUNTRIES} />
    </div>
  );
}
