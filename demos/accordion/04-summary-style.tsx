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
        <p className="demo-label">Highlighted (default)</p>
        <div>
          <Accordion summary="Billing" defaultExpanded>
            Invoices are issued on the 1st of every month.
          </Accordion>
          <Accordion summary="Payment methods">Card, bank transfer and direct debit.</Accordion>
        </div>
      </div>
      <div className="demo-group">
        <p className="demo-label">summaryStyle=&quot;plain&quot;</p>
        <AccordionGroup summaryStyle="plain" exclusive={false}>
          <Accordion summary="Billing" defaultExpanded>
            Invoices are issued on the 1st of every month.
          </Accordion>
          <Accordion summary="Payment methods">Card, bank transfer and direct debit.</Accordion>
        </AccordionGroup>
      </div>
      <div className="demo-group">
        <p className="demo-label">Highlighted outlined</p>
        <div>
          <Accordion variant="outlined" summary="Billing" defaultExpanded>
            Invoices are issued on the 1st of every month.
          </Accordion>
          <Accordion variant="outlined" summary="Payment methods">
            Card, bank transfer and direct debit.
          </Accordion>
        </div>
      </div>
      <div className="demo-group">
        <p className="demo-label">Custom variables</p>
        <div style={brand}>
          <Accordion summary="Billing" defaultExpanded>
            Invoices are issued on the 1st of every month.
          </Accordion>
          <Accordion summary="Payment methods">Card, bank transfer and direct debit.</Accordion>
        </div>
      </div>
    </div>
  );
}
