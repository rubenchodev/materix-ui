import { Switch } from '@rubenchodev/materix-react/components/switch';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: "Write just <Switch label>. The component renders the track, the thumb and the label, and adds role=\"switch\" so it is announced as \"on / off\".",
  es: "Escribe solo <Switch label>. El componente renderiza la pista, el thumb y el texto, y añade role=\"switch\" para que se anuncie como «activado / desactivado».",
};

export default function Demo() {
  return (
    <div className="demo-row">
      <Switch label="Wi-Fi" defaultChecked />
      <Switch label="Bluetooth" />
    </div>
  );
}
