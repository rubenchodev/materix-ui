import { ToggleButton, ToggleButtonGroup } from '@rubenchodev/materix-react/components/toggle-button';

export const title = { en: 'Full width', es: 'Ancho completo' };
export const description = {
  en: "`fullWidth` fills the container and splits the width evenly between the buttons.",
  es: "`fullWidth` ocupa el contenedor y reparte el ancho a partes iguales entre los botones.",
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <ToggleButtonGroup exclusive fullWidth color="primary" defaultValue="monthly" aria-label="Facturación">
        <ToggleButton value="monthly">Mensual</ToggleButton>
        <ToggleButton value="yearly">Anual</ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}
