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
        <p className="demo-label">Preguntas frecuentes de facturación</p>
        <AccordionGroup variant="outlined">
          <Accordion component="details" summary="¿Puedo cambiar de plan más adelante?" defaultExpanded>
            <p>Sí. Las mejoras se aplican al momento y se prorratean; las bajadas de plan se aplican al final del periodo de facturación.</p>
          </Accordion>
          <Accordion component="details" summary="¿Qué métodos de pago aceptáis?">
            <p>Tarjetas de crédito, Apple Pay y Google Pay. Los planes anuales también pueden pagarse por transferencia.</p>
          </Accordion>
          <Accordion component="details" summary="¿Puedo cancelar en cualquier momento?">
            <p>Sí. Los planes mensuales se pueden cancelar cuando quieras; los anuales tienen reembolso completo durante 30 días.</p>
          </Accordion>
        </AccordionGroup>
      </div>
      <div className="demo-group">
        <p className="demo-label">Ajustes con texto secundario</p>
        <AccordionGroup>
          <Accordion>
            <AccordionSummary secondary="Laura Gómez · laura@acme.com">
              <span className="mtx-w-50 mtx-flex-shrink-0">Perfil</span>
            </AccordionSummary>
            <AccordionDetails>Nombre, foto y correo electrónico de la cuenta.</AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary secondary="2FA activado">
              <span className="mtx-w-50 mtx-flex-shrink-0">Seguridad</span>
            </AccordionSummary>
            <AccordionDetails>Contraseña, verificación en dos pasos y sesiones abiertas.</AccordionDetails>
          </Accordion>
        </AccordionGroup>
      </div>
    </div>
  );
}
