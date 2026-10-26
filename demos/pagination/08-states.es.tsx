import { Pagination } from '@rubenchodev/materix-react/components/pagination';

export const title = { en: 'States', es: 'Estados' };
export const description = {
  en: "Hover, focus-visible (Tab) and ripple on press. Previous/next are disabled automatically at the ends and focus moves to the current page if the focused button gets disabled. `disabled` disables everything.",
  es: "Hover, focus-visible (Tab) y ripple al pulsar. Anterior/siguiente se deshabilitan solos en los extremos y el foco pasa a la página actual si el botón enfocado queda deshabilitado. `disabled` lo deshabilita todo.",
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">Normal · hover · focus-visible · pulsado</span>
        <Pagination count={5} defaultPage={2} color="primary" aria-label="Estados interactivos" />
      </div>
      <div className="demo-group">
        <span className="demo-label">Última página · siguiente deshabilitado</span>
        <Pagination count={5} defaultPage={5} color="primary" aria-label="Última página" />
      </div>
      <div className="demo-group">
        <span className="demo-label">Deshabilitada</span>
        <Pagination count={5} defaultPage={2} color="primary" disabled aria-label="Texto deshabilitado" />
        <Pagination count={5} defaultPage={2} variant="outlined" color="primary" disabled aria-label="Con borde deshabilitado" />
      </div>
    </div>
  );
}
