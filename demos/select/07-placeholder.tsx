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
        label="Role"
        placeholder="Choose a role"
        required
        options={[
          { value: 'admin', label: 'Administrator' },
          { value: 'editor', label: 'Editor' },
          { value: 'viewer', label: 'Viewer' },
        ]}
      />
      <Select label="Plan" variant="filled" placeholder="No plan" defaultValue="" options={[{ value: '', label: 'None' }, { value: 'pro', label: 'Professional' }]} />
      <Select
        label="Shipping address"
        startIcon="local_shipping"
        options={[
          { value: '1', label: '1600 Amphitheatre Parkway, Building 43, Mountain View, CA 94043, United States' },
          { value: '2', label: '221B Baker Street, Marylebone, London NW1 6XE, United Kingdom' },
        ]}
      />
    </div>
  );
}
