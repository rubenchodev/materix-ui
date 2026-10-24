import { MobileStepper } from '@rubenchodev/materix-react/components/stepper';

export const title = { en: 'Mobile stepper', es: 'Stepper móvil' };
export const description = {
  en: "`MobileStepper` renders Back/Next buttons and a `dots`, `text` or `progress` indicator; `position=\"bottom|top\"` pins it to the viewport.",
  es: "`MobileStepper` genera los botones Atrás/Siguiente y un indicador `dots`, `text` o `progress`; `position=\"bottom|top\"` lo fija al viewport.",
};

export default function Demo() {
  return (
    <div className="demo-grid-3">
      <div className="demo-group">
        <span className="demo-label">Dots</span>
        <MobileStepper steps={6} defaultActiveStep={1} />
      </div>
      <div className="demo-group">
        <span className="demo-label">Text</span>
        <MobileStepper variant="text" steps={5} />
      </div>
      <div className="demo-group">
        <span className="demo-label">Progress</span>
        <MobileStepper variant="progress" steps={6} defaultActiveStep={2} />
      </div>
    </div>
  );
}
