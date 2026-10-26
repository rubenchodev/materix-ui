import { Select } from '@rubenchodev/materix-react/components/select';

export const title = { en: 'Search', es: 'Búsqueda' };
export const description = {
  en: "`search` filters by text and value, ignoring case and accents; `header` adds a header and `noResultsText` the no-match message (`{0}` = search term). Try typing \"zz\".",
  es: "`search` filtra por texto y valor sin distinguir mayúsculas ni tildes; `header` añade una cabecera y `noResultsText` el mensaje sin coincidencias (`{0}` = término). Prueba a escribir \"zz\".",
};

const COUNTRIES = [
  ['ar', 'Argentina'],
  ['bo', 'Bolivia'],
  ['cl', 'Chile'],
  ['co', 'Colombia'],
  ['cr', 'Costa Rica'],
  ['ec', 'Ecuador'],
  ['es', 'España'],
  ['mx', 'México'],
  ['pe', 'Perú'],
  ['uy', 'Uruguay'],
].map(([value, label]) => ({ value, label }));

export default function Demo() {
  return (
    <div className="demo-fixed-width">
      <Select label="País" search header="Selecciona un país" noResultsText={'Ningún país coincide con «{0}»'} options={COUNTRIES} />
    </div>
  );
}
