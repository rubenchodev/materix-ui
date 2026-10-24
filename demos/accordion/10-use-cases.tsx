import { Accordion, AccordionDetails, AccordionGroup, AccordionSummary } from '@rubenchodev/materix-react/components/accordion';

export const title = { en: 'Real-world examples', es: 'Ejemplos reales' };
export const description = {
  en: 'An FAQ with `component="details"` in an exclusive group, and settings whose summary carries secondary text (`AccordionSummary` with `secondary`).',
  es: 'Unas FAQ con `component="details"` en un grupo exclusivo, y unos ajustes cuyo resumen lleva texto secundario (`AccordionSummary` con `secondary`).',
};

export default function Demo() {
  return (
    <div className="demo-stack demo-wide">
      <div className="demo-group">
        <p className="demo-label">Billing FAQ</p>
        <AccordionGroup variant="outlined">
          <Accordion component="details" summary="Can I change plans later?" defaultExpanded>
            <p>Yes. Upgrades take effect immediately and are prorated; downgrades apply at the end of the billing period.</p>
          </Accordion>
          <Accordion component="details" summary="Which payment methods do you accept?">
            <p>Credit cards, Apple Pay and Google Pay. Annual plans can also pay by bank transfer.</p>
          </Accordion>
          <Accordion component="details" summary="Can I cancel at any time?">
            <p>Yes. Monthly plans can be canceled anytime; annual plans get a full refund within 30 days.</p>
          </Accordion>
        </AccordionGroup>
      </div>
      <div className="demo-group">
        <p className="demo-label">Settings with secondary text</p>
        <AccordionGroup>
          <Accordion>
            <AccordionSummary secondary="Laura Gomez · laura@acme.com">
              <span className="mtx-w-50 mtx-flex-shrink-0">Profile</span>
            </AccordionSummary>
            <AccordionDetails>Account name, photo and email address.</AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary secondary="2FA enabled">
              <span className="mtx-w-50 mtx-flex-shrink-0">Security</span>
            </AccordionSummary>
            <AccordionDetails>Password, two-step verification and active sessions.</AccordionDetails>
          </Accordion>
        </AccordionGroup>
      </div>
    </div>
  );
}
