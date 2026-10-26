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
        <p className="demo-label">Solo un panel abierto</p>
        <AccordionGroup>
          <Accordion summary="Ajustes generales" defaultExpanded>
            Idioma, zona horaria y formato de fecha.
          </Accordion>
          <Accordion summary="Usuarios">Gestiona miembros y permisos.</Accordion>
          <Accordion summary="Ajustes avanzados">Integraciones, webhooks y claves de API.</Accordion>
        </AccordionGroup>
      </div>
      <div className="demo-group">
        <p className="demo-label">Varios abiertos (exclusive=false)</p>
        <AccordionGroup exclusive={false} variant="outlined">
          <Accordion summary="Notificaciones por correo" defaultExpanded>
            Resumen semanal y alertas de seguridad.
          </Accordion>
          <Accordion summary="Notificaciones push" defaultExpanded>
            Menciones y mensajes directos.
          </Accordion>
          <Accordion summary="SMS">Solo verificaciones de inicio de sesión.</Accordion>
        </AccordionGroup>
      </div>
    </div>
  );
}
