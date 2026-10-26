import { Select } from '@rubenchodev/materix-react/components/select';

export const title = { en: 'Colors', es: 'Colores' };
export const description = {
  en: "`color` accepts the whole MUI palette: it changes the label, the border or underline on focus and the selected option in the menu. Use Tab or open them to compare.",
  es: "`color` acepta toda la paleta MUI: cambia el label, el borde o subrayado con foco y la opción seleccionada del menú. Usa Tab o ábrelos para comparar.",
};

const OPTIONS = [
  { value: '1', label: 'Opción 1' },
  { value: '2', label: 'Opción 2' },
];

export default function Demo() {
  return (
    <div className="demo-grid-3">
      <Select label="Primary (por defecto)" options={OPTIONS} />
      <Select label="Secondary" color="secondary" options={OPTIONS} />
      <Select label="Error" color="error" options={OPTIONS} />
      <Select label="Warning" color="warning" variant="filled" options={OPTIONS} />
      <Select label="Info" color="info" variant="filled" options={OPTIONS} />
      <Select label="Success" color="success" variant="standard" options={OPTIONS} />
    </div>
  );
}
