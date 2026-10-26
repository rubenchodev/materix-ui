import { Select } from '@rubenchodev/materix-react/components/select';

export const title = { en: 'Automatic positioning', es: 'Posicionamiento automático' };
export const description = {
  en: "The menu is mounted in a portal, repositions itself on scroll, opens upwards when it does not fit below, limits its height to the available space and closes when the control leaves the viewport.",
  es: "El menú se monta en un portal, se recoloca con el scroll, se abre hacia arriba cuando no cabe debajo, limita su alto al espacio disponible y se cierra cuando el control sale del viewport.",
};

const CITIES = ['Ámsterdam', 'Berlín', 'Bogotá', 'Buenos Aires', 'Lima', 'Lisboa', 'Madrid', 'Ciudad de México', 'París', 'Roma'].map(
  (label, index) => ({ value: String(index + 1), label }),
);

export default function Demo() {
  return (
    <div className="demo-panel">
      <div className="demo-fixed-width">
        <Select label="Destino" search header="Menú cerca del borde" options={CITIES} />
      </div>
    </div>
  );
}
