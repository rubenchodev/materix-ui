import type { CSSProperties } from 'react';
import { Tab, Tabs } from '@rubenchodev/materix-react/components/tabs';

export const title = { en: 'Colors', es: 'Colores' };
export const description = {
  en: "The active tab and the indicator use `--mtx-color-primary`. As in vanilla there are no color props: redefine the token on a container to use another palette color.",
  es: "La pestaña activa y el indicador usan `--mtx-color-primary`. Como en vanilla, no hay props de color: redefine el token en un contenedor para usar otro color de la paleta.",
};

/** El color activo sale de `--mtx-color-primary`: se redefine en un contenedor. */
const secondary = { '--mtx-color-primary': 'var(--mtx-color-secondary)' } as CSSProperties;

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">primary · por defecto</span>
        <Tabs aria-label="Primario">
          <Tab label="Elemento uno" />
          <Tab label="Elemento dos" />
        </Tabs>
      </div>
      <div className="demo-group">
        <span className="demo-label">--mtx-color-primary: var(--mtx-color-secondary)</span>
        <div style={secondary}>
          <Tabs aria-label="Secundario">
            <Tab label="Elemento uno" />
            <Tab label="Elemento dos" />
          </Tabs>
        </div>
      </div>
    </div>
  );
}
