import { Pagination } from '@rubenchodev/materix-react/components/pagination';

export const title = { en: 'Sizes', es: 'Tamaños' };
export const description = {
  en: "Three canonical sizes, like MUI `PaginationItem`: large (40px), medium (32px, default) and small (26px).",
  es: "Tres tamaños canónicos, como el `PaginationItem` de MUI: large (40px), medium (32px, por defecto) y small (26px).",
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">Grande · 40px</span>
        <Pagination count={10} size="large" color="primary" aria-label="Grande" />
      </div>
      <div className="demo-group">
        <span className="demo-label">Mediana · 32px</span>
        <Pagination count={10} color="primary" aria-label="Mediana" />
      </div>
      <div className="demo-group">
        <span className="demo-label">Pequeña · 26px</span>
        <Pagination count={10} size="small" color="primary" aria-label="Pequeña" />
      </div>
    </div>
  );
}
