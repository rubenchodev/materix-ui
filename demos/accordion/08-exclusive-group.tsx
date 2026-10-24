import { Accordion, AccordionGroup } from '@rubenchodev/materix-react/components/accordion';

export const title = { en: 'Exclusive group', es: 'Grupo exclusivo' };
export const description = {
  en: '`AccordionGroup` keeps a single panel open and enables Arrow, Home and End navigation between summaries; `exclusive={false}` allows several. The group passes `variant`, `elevation`, `square`, `disableGutters` and `summaryStyle` down.',
  es: '`AccordionGroup` mantiene un solo panel abierto y habilita la navegación con flechas, Inicio y Fin entre resúmenes; `exclusive={false}` permite varios. El grupo transmite `variant`, `elevation`, `square`, `disableGutters` y `summaryStyle`.',
};

export default function Demo() {
  return (
    <div className="demo-stack demo-wide">
      <div className="demo-group">
        <p className="demo-label">Only one panel open</p>
        <AccordionGroup>
          <Accordion summary="General settings" defaultExpanded>
            Language, time zone and date format.
          </Accordion>
          <Accordion summary="Users">Manage members and permissions.</Accordion>
          <Accordion summary="Advanced settings">Integrations, webhooks and API keys.</Accordion>
        </AccordionGroup>
      </div>
      <div className="demo-group">
        <p className="demo-label">Several open (exclusive=false)</p>
        <AccordionGroup exclusive={false} variant="outlined">
          <Accordion summary="Email notifications" defaultExpanded>
            Weekly digest and security alerts.
          </Accordion>
          <Accordion summary="Push notifications" defaultExpanded>
            Mentions and direct messages.
          </Accordion>
          <Accordion summary="SMS">Sign-in verifications only.</Accordion>
        </AccordionGroup>
      </div>
    </div>
  );
}
