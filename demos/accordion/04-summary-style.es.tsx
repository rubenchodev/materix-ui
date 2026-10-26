import type { CSSProperties } from 'react';
import { Accordion, AccordionGroup } from '@rubenchodev/materix-react/components/accordion';

export const title = { en: 'Summary style', es: 'Estilo del resumen' };
export const description = {
  en: 'The summary uses weight 500 and, when expanded, its own background and a bottom divider (also with `outlined`). `summaryStyle="plain"` (panel or group) restores the flat MUI look; customize it with the `--mtx-accordion-summary-*` variables.',
  es: 'El resumen usa peso 500 y, al expandirse, fondo propio y un divisor inferior (también con `outlined`). `summaryStyle="plain"` (panel o grupo) recupera el aspecto plano de MUI; personalízalo con las variables `--mtx-accordion-summary-*`.',
};

const brand = {
  '--mtx-accordion-summary-font-weight': 700,
  '--mtx-accordion-summary-expanded-bg': 'color-mix(in srgb, var(--mtx-color-primary) 12%, transparent)',
  '--mtx-accordion-summary-expanded-divider': 'var(--mtx-color-primary)',
} as CSSProperties;

export default function Demo() {
  return (
    <div className="demo-grid-2 mtx-w-100">
      <div className="demo-group">
        <p className="demo-label">Destacado (predeterminado)</p>
        <div>
          <Accordion summary="Facturación" defaultExpanded>
            Las facturas se emiten el día 1 de cada mes.
          </Accordion>
          <Accordion summary="Métodos de pago">Tarjeta, transferencia y domiciliación.</Accordion>
        </div>
      </div>
      <div className="demo-group">
        <p className="demo-label">summaryStyle=&quot;plain&quot;</p>
        <AccordionGroup summaryStyle="plain" exclusive={false}>
          <Accordion summary="Facturación · Plano" defaultExpanded>
            Las facturas se emiten el día 1 de cada mes.
          </Accordion>
          <Accordion summary="Métodos de pago · Plano">Tarjeta, transferencia y domiciliación.</Accordion>
        </AccordionGroup>
      </div>
      <div className="demo-group">
        <p className="demo-label">Destacado con borde</p>
        <div>
          <Accordion variant="outlined" summary="Facturación · Con borde" defaultExpanded>
            Las facturas se emiten el día 1 de cada mes.
          </Accordion>
          <Accordion variant="outlined" summary="Métodos de pago · Con borde">
            Tarjeta, transferencia y domiciliación.
          </Accordion>
        </div>
      </div>
      <div className="demo-group">
        <p className="demo-label">Variables personalizadas</p>
        <div style={brand}>
          <Accordion summary="Facturación · Personalizado" defaultExpanded>
            Las facturas se emiten el día 1 de cada mes.
          </Accordion>
          <Accordion summary="Métodos de pago · Personalizado">Tarjeta, transferencia y domiciliación.</Accordion>
        </div>
      </div>
    </div>
  );
}
