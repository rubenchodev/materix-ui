import { Select } from '@rubenchodev/materix-react/components/select';

export const title = { en: 'Placeholder and long text', es: 'Placeholder y texto largo' };
export const description = {
  en: "In single selection, `placeholder` is shown while there is no value (the native select stays empty and `required` validates it). Long text is truncated with an ellipsis without widening the field.",
  es: "En selección única, `placeholder` se muestra mientras no hay valor (el select nativo queda vacío y `required` lo valida). El texto largo se recorta con puntos suspensivos sin ensanchar el campo.",
};

export default function Demo() {
  return (
    <div className="demo-grid-3">
      <Select
        label="Rol"
        placeholder="Elige un rol"
        required
        options={[
          { value: 'admin', label: 'Administrador' },
          { value: 'editor', label: 'Editor' },
          { value: 'viewer', label: 'Lector' },
        ]}
      />
      <Select label="Plan" variant="filled" placeholder="Sin plan" defaultValue="" options={[{ value: '', label: 'Ninguno' }, { value: 'pro', label: 'Profesional' }]} />
      <Select
        label="Dirección de envío"
        startIcon="local_shipping"
        options={[
          { value: '1', label: 'Calle de Alcalá 123, 4.º izquierda, 28009 Madrid, España' },
          { value: '2', label: 'Avenida Insurgentes Sur 1602, 03940 Ciudad de México' },
        ]}
      />
    </div>
  );
}
