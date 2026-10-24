import { createRef, useState } from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectParity, mountVanilla } from '../../../tests/parity';
import { I18nProvider } from '../../i18n';
import {
  MobileStepper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  StepperButton,
  StepPanel,
  useStepper,
} from './index';
import type { StepperApi, StepperBaseApi } from './index';

const PARITY = { attributes: ['viewBox', 'focusable'] };

const steps = (root: Element) => Array.from(root.querySelectorAll(':scope > .mtx-step'));

describe('Stepper', () => {
  it('construye la anatomía desde la sintaxis simplificada', () => {
    const { container } = render(<Stepper defaultActiveStep={1} steps={['Email', 'Code', 'Password']} />);
    const root = container.firstElementChild!;
    expect(root.tagName).toBe('OL');
    expect(root).toHaveClass('mtx-stepper', 'mtx-stepper--horizontal');
    const [a, b] = steps(root);
    expect(a.querySelector('.mtx-step-connector')).toBeNull();
    expect(b.querySelector(':scope > .mtx-step-connector')).toHaveAttribute('aria-hidden', 'true');
    expect(a.querySelector('.mtx-step__label')).toHaveTextContent('Email');
    expect(a.querySelector('.mtx-step__icon-container')).toHaveAttribute('aria-hidden', 'true');
  });

  it('estado lineal: completados anteriores, activo con aria-current y futuros deshabilitados', () => {
    const { container } = render(
      <Stepper defaultActiveStep={1}>
        <Step label="Email" />
        <Step label="Code" />
        <Step label="Password" />
      </Stepper>,
    );
    const [a, b, c] = steps(container.firstElementChild!);
    expect(a).toHaveClass('mtx-step--completed');
    expect(a.querySelector('svg.mtx-step-icon--completed')).not.toBeNull();
    expect(b).toHaveClass('mtx-step--active');
    expect(b).toHaveAttribute('aria-current', 'step');
    expect(b.querySelector('.mtx-step-icon--number')).toHaveTextContent('2');
    expect(c).toHaveClass('mtx-step--disabled', 'mtx-step--last');
    expect(a).not.toHaveAttribute('aria-current');
  });

  it('textos accesibles con posición y estado, traducidos', () => {
    const { container, rerender } = render(<Stepper defaultActiveStep={1} steps={['Email', 'Code', 'Password']} />);
    expect(container.querySelector('.mtx-step__label-container')!.textContent).toBe('Step 1 of 3: Email, completed');
    rerender(
      <I18nProvider locale="es">
        <Stepper defaultActiveStep={1} steps={['Email', 'Code', 'Password']} />
      </I18nProvider>,
    );
    expect(container.querySelector('.mtx-step__label-container')!.textContent).toBe('Paso 1 de 3: Email, completado');
  });

  it('API imperativa: next, back, goTo, activeStep y estado terminado', () => {
    const api = createRef<StepperApi>();
    const { container } = render(<Stepper apiRef={api} defaultActiveStep={1} steps={['A', 'B', 'C']} />);
    const root = container.firstElementChild!;
    expect(api.current!.activeStep).toBe(1);
    act(() => {
      expect(api.current!.next()).toBe(true);
    });
    expect(api.current!.activeStep).toBe(2);
    act(() => {
      api.current!.next();
    });
    expect(api.current!.finished).toBe(true);
    expect(root).toHaveClass('mtx-stepper--finished');
    expect(steps(root).every((s) => s.classList.contains('mtx-step--completed'))).toBe(true);
    act(() => {
      expect(api.current!.next()).toBe(false);
      api.current!.back();
      api.current!.goTo(0);
    });
    expect(api.current!.activeStep).toBe(0);
    expect(api.current!.goTo(9)).toBe(false);
  });

  it('onChange cancelable (false o preventDefault) con activeStep y previousStep', () => {
    const api = createRef<StepperApi>();
    const onChange = vi.fn((_: number, detail: { preventDefault: () => void }) => detail.preventDefault());
    render(<Stepper apiRef={api} onChange={onChange} steps={['A', 'B']} />);
    act(() => {
      expect(api.current!.next()).toBe(false);
    });
    expect(onChange).toHaveBeenCalledWith(1, expect.objectContaining({ activeStep: 1, previousStep: 0 }));
    expect(api.current!.activeStep).toBe(0);
    const api2 = createRef<StepperApi>();
    render(<Stepper apiRef={api2} onChange={() => false} steps={['A', 'B']} />);
    act(() => {
      expect(api2.current!.next()).toBe(false);
    });
  });

  it('controlado: refleja activeStep y notifica sin cambiar por sí mismo', () => {
    const api = createRef<StepperApi>();
    const onChange = vi.fn();
    const { container, rerender } = render(<Stepper apiRef={api} activeStep={0} onChange={onChange} steps={['A', 'B', 'C']} />);
    act(() => {
      api.current!.next();
    });
    expect(onChange).toHaveBeenCalledWith(1, expect.anything());
    rerender(<Stepper apiRef={api} activeStep={2} onChange={onChange} steps={['A', 'B', 'C']} />);
    expect(steps(container.firstElementChild!)[2]).toHaveClass('mtx-step--active');
  });

  it('controlado: si el padre no actualiza activeStep, la API no avanza', () => {
    const api = createRef<StepperApi>();
    const onChange = vi.fn();
    render(<Stepper apiRef={api} activeStep={0} onChange={onChange} steps={['A', 'B', 'C']} />);
    act(() => {
      api.current!.next();
      api.current!.next();
    });
    expect(onChange).toHaveBeenNthCalledWith(1, 1, expect.objectContaining({ previousStep: 0 }));
    expect(onChange).toHaveBeenNthCalledWith(2, 1, expect.objectContaining({ previousStep: 0 }));
    expect(api.current!.activeStep).toBe(0);

    const mobile = createRef<StepperBaseApi>();
    render(<MobileStepper apiRef={mobile} steps={3} activeStep={0} onChange={() => undefined} />);
    act(() => {
      mobile.current!.next();
      mobile.current!.next();
    });
    expect(mobile.current!.activeStep).toBe(0);
  });

  it('optional, error con mensaje y disabled', () => {
    const { container } = render(
      <Stepper nonLinear>
        <Step label="A" optional />
        <Step label="B" optional="Can be skipped" />
        <Step label="C" error="Card declined" />
        <Step label="D" error />
        <Step label="E" disabled />
      </Stepper>,
    );
    const [a, b, c, d, e] = steps(container.firstElementChild!);
    expect(a.querySelector('.mtx-step__optional')).toHaveTextContent('Optional');
    expect(b.querySelector('.mtx-step__optional')).toHaveTextContent('Can be skipped');
    expect(c).toHaveClass('mtx-step--error');
    expect(c.querySelector('.mtx-step__optional')).toHaveTextContent('Card declined');
    expect(c.querySelector('svg.mtx-step-icon--error')).not.toBeNull();
    expect(d.querySelector('.mtx-step__sr-status')).toHaveTextContent(', error');
    expect(e).toHaveClass('mtx-step--disabled');
    expect(e).toHaveAttribute('data-disabled');
    expect(e.querySelector('button')).toBeDisabled();
  });

  it('setCompleted, setError y reset', () => {
    const api = createRef<StepperApi>();
    const { container } = render(<Stepper apiRef={api} nonLinear steps={['A', 'B', 'C']} />);
    const root = container.firstElementChild!;
    act(() => {
      api.current!.setCompleted(1);
      api.current!.setError(2, 'Required');
    });
    expect(steps(root)[1]).toHaveClass('mtx-step--completed');
    expect(api.current!.isCompleted(1)).toBe(true);
    expect(steps(root)[2].querySelector('.mtx-step__optional')).toHaveTextContent('Required');
    act(() => {
      api.current!.goTo(2);
    });
    act(() => {
      expect(api.current!.reset()).toBe(true);
    });
    expect(api.current!.activeStep).toBe(0);
    expect(root.querySelector('.mtx-step--completed, .mtx-step--error')).toBeNull();
  });

  it('modo no lineal: StepButton clicable con aria-current en el botón y next salta deshabilitados', async () => {
    const user = userEvent.setup();
    const api = createRef<StepperApi>();
    const { container } = render(
      <Stepper apiRef={api} nonLinear>
        <Step label="A" />
        <Step label="B" disabled />
        <Step label="C" />
      </Stepper>,
    );
    const buttons = container.querySelectorAll('button.mtx-step-button');
    expect(buttons).toHaveLength(3);
    expect(buttons[0]).toHaveAttribute('aria-current', 'step');
    expect(steps(container.firstElementChild!)[0]).not.toHaveAttribute('aria-current');
    await user.click(buttons[2]);
    expect(api.current!.activeStep).toBe(2);
    expect(buttons[2]).toHaveAttribute('aria-current', 'step');
    act(() => {
      api.current!.back();
    });
    expect(api.current!.activeStep).toBe(0);
    (buttons[0] as HTMLButtonElement).focus();
    await user.keyboard('{Tab}{Enter}');
    expect(api.current!.activeStep).toBe(2);
  });

  it('vertical: el contenido pasa a StepContent y solo el activo está expandido', () => {
    const { container } = render(
      <Stepper orientation="vertical">
        <Step label="A">
          <p>Uno</p>
        </Step>
        <Step label="B" expanded>
          <p>Dos</p>
        </Step>
        <Step label="C">
          <p>Tres</p>
        </Step>
      </Stepper>,
    );
    const [a, b, c] = steps(container.firstElementChild!);
    expect(container.firstElementChild).toHaveClass('mtx-stepper--vertical');
    expect(a).toHaveClass('mtx-step--expanded');
    expect(a.querySelector('.mtx-step__content-inner p')).toHaveTextContent('Uno');
    expect(a.querySelector('.mtx-step__content')).toHaveAttribute('aria-hidden', 'false');
    expect(b).toHaveClass('mtx-step--expanded');
    expect(c.querySelector('.mtx-step__content')).toHaveAttribute('aria-hidden', 'true');
    expect(c.querySelector('.mtx-step__content')).toHaveAttribute('inert');
  });

  it('composición manual con StepLabel y StepContent, icono propio y alternativeLabel', () => {
    const { container } = render(
      <Stepper alternativeLabel defaultActiveStep={1}>
        <Step icon="person">
          <StepLabel>Account</StepLabel>
        </Step>
        <Step>
          <StepLabel icon="credit_card">Payment</StepLabel>
          <StepContent>Body</StepContent>
        </Step>
      </Stepper>,
    );
    const root = container.firstElementChild!;
    expect(root).toHaveClass('mtx-stepper--alternative-label');
    const [, b] = steps(root);
    expect(b.querySelector('.mtx-step-icon--custom')).toHaveTextContent('credit_card');
    expect(b.querySelector('.mtx-step-icon--custom')).toHaveClass('material-icons', 'mtx-step-icon--active');
    expect(b.querySelector('.mtx-step__content')).toHaveAttribute('aria-hidden', 'true');
  });

  it('alternativeLabel se ignora en vertical; ref, className y label', () => {
    const ref = createRef<HTMLOListElement>();
    render(<Stepper ref={ref} className="extra" orientation="vertical" alternativeLabel label="Wizard" steps={['A']} />);
    expect(ref.current).toHaveClass('mtx-stepper', 'extra', 'mtx-stepper--vertical');
    expect(ref.current).not.toHaveClass('mtx-stepper--alternative-label');
    expect(screen.getByRole('list', { name: 'Wizard' })).toBe(ref.current);
  });

  it('useStepper + StepperButton + StepPanel (acciones y paneles declarativos)', async () => {
    const user = userEvent.setup();
    function Wizard() {
      const stepper = useStepper();
      return (
        <>
          <Stepper apiRef={stepper.apiRef} steps={['A', 'B']} />
          <StepPanel stepper={stepper} index={0}>P1</StepPanel>
          <StepPanel stepper={stepper} index={1}>P2</StepPanel>
          <StepPanel stepper={stepper} index="finished">Done</StepPanel>
          <StepperButton action="back" stepper={stepper}>Back</StepperButton>
          <StepperButton action="next" stepper={stepper}>Next</StepperButton>
          <StepperButton action="reset" stepper={stepper}>Reset</StepperButton>
        </>
      );
    }
    render(<Wizard />);
    const back = screen.getByRole('button', { name: 'Back' });
    const next = screen.getByRole('button', { name: 'Next' });
    expect(back).toBeDisabled();
    expect(screen.getByText('P1')).toBeVisible();
    expect(screen.getByText('P2')).not.toBeVisible();
    await user.click(next);
    expect(screen.getByText('P2')).toBeVisible();
    expect(back).toBeEnabled();
    await user.click(next);
    expect(screen.getByText('Done')).toBeVisible();
    expect(next).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByText('P1')).toBeVisible();
  });

  it('StepperButton dentro del contenido vertical actúa sobre su stepper', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Stepper orientation="vertical">
        <Step label="A">
          <StepperButton action="next">Continue</StepperButton>
        </Step>
        <Step label="B">
          <StepperButton action="back">Back</StepperButton>
        </Step>
      </Stepper>,
    );
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(steps(container.firstElementChild!)[1]).toHaveClass('mtx-step--active');
  });

  it('paridad con vanilla: lineal, error y opcional', async () => {
    const vanilla = await mountVanilla(
      '<ol data-mtx="stepper" data-active-step="1" aria-label="Pay"><li data-label="Address"></li><li data-label="Payment" data-error="Card declined"></li><li data-label="Review" data-optional></li></ol>',
    );
    const { container } = render(
      <Stepper defaultActiveStep={1} label="Pay">
        <Step label="Address" />
        <Step label="Payment" error="Card declined" />
        <Step label="Review" optional />
      </Stepper>,
    );
    expectParity(container.firstElementChild, vanilla.firstElementChild, PARITY);
  });

  it('paridad con vanilla: no lineal con completado y deshabilitado', async () => {
    const vanilla = await mountVanilla(
      '<ol data-mtx="stepper" data-non-linear data-active-step="1"><li data-label="A" data-completed></li><li data-label="B" data-icon="person"></li><li data-label="C" data-disabled></li></ol>',
    );
    const { container } = render(
      <Stepper nonLinear defaultActiveStep={1}>
        <Step label="A" completed />
        <Step label="B" icon="person" />
        <Step label="C" disabled />
      </Stepper>,
    );
    expectParity(container.firstElementChild, vanilla.firstElementChild, PARITY);
  });

  it('paridad con vanilla: vertical con contenido', async () => {
    const vanilla = await mountVanilla(
      '<ol data-mtx="stepper" data-orientation="vertical"><li data-label="A"><p>Uno</p></li><li data-label="B"><p>Dos</p></li></ol>',
    );
    const { container } = render(
      <Stepper orientation="vertical">
        <Step label="A">
          <p>Uno</p>
        </Step>
        <Step label="B">
          <p>Dos</p>
        </Step>
      </Stepper>,
    );
    expectParity(container.firstElementChild, vanilla.firstElementChild, { ...PARITY, attributes: [...PARITY.attributes, 'inert'] });
  });
});

describe('MobileStepper', () => {
  it('dots: botones, puntos y estado accesible', async () => {
    const user = userEvent.setup();
    const api = createRef<StepperBaseApi>();
    const { container } = render(<MobileStepper apiRef={api} steps={4} />);
    const root = container.firstElementChild!;
    expect(root).toHaveClass('mtx-mobile-stepper', 'mtx-mobile-stepper--dots', 'mtx-mobile-stepper--static');
    expect(root.querySelectorAll('.mtx-mobile-stepper__dot')).toHaveLength(4);
    expect(root.querySelector('.mtx-mobile-stepper__dot--active')).toBe(root.querySelector('.mtx-mobile-stepper__dot'));
    const back = root.querySelector('.mtx-mobile-stepper__back') as HTMLButtonElement;
    const next = root.querySelector('.mtx-mobile-stepper__next') as HTMLButtonElement;
    expect(back).toBeDisabled();
    expect(back).toHaveTextContent('Back');
    expect(next).toHaveTextContent('Next');
    expect(root.querySelector('.mtx-mobile-stepper__status')).toHaveTextContent('Step 1 of 4');
    await user.click(next);
    expect(api.current!.activeStep).toBe(1);
    expect(back).toBeEnabled();
    act(() => {
      api.current!.goTo(3);
    });
    expect(next).toBeDisabled();
    expect(api.current!.next()).toBe(false);
  });

  it('text y progress', () => {
    const { container } = render(
      <>
        <MobileStepper variant="text" steps={5} defaultActiveStep={2} />
        <MobileStepper variant="progress" steps={5} activeStep={4} position="bottom" />
      </>,
    );
    const [text, progress] = container.querySelectorAll('.mtx-mobile-stepper');
    expect(text.querySelector('.mtx-mobile-stepper__indicator')).toHaveTextContent('3 / 5');
    expect(progress).toHaveClass('mtx-mobile-stepper--bottom');
    const bar = progress.querySelector('.mtx-linear-progress.mtx-mobile-stepper__progress')!;
    expect(bar).toHaveAttribute('aria-hidden', 'true');
    expect((bar.querySelector('.mtx-linear-progress__bar1') as HTMLElement).style.transform).toBe('translateX(0.000%)');
  });

  it('traduce, botones propios y cambio cancelable', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn(() => false);
    render(
      <I18nProvider locale="es">
        <MobileStepper steps={3} onChange={onChange} />
      </I18nProvider>,
    );
    expect(screen.getByRole('button', { name: /Atrás/ })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: /Siguiente/ }));
    expect(onChange).toHaveBeenCalled();
    expect(screen.getByText('Paso 1 de 3')).toBeInTheDocument();

    function Custom() {
      const [step, setStep] = useState(0);
      return (
        <MobileStepper
          steps={3}
          activeStep={step}
          onChange={(index) => setStep(index)}
          backButton={<button type="button" className="mtx-mobile-stepper__back">Prev</button>}
          nextButton={<button type="button" className="mtx-mobile-stepper__next">Fwd</button>}
        />
      );
    }
    render(<Custom />);
    await user.click(screen.getByRole('button', { name: 'Fwd' }));
    expect(screen.getByText('Step 2 of 3')).toBeInTheDocument();
  });

  it('paridad con vanilla: dots', async () => {
    const vanilla = await mountVanilla('<div data-mtx="mobile-stepper" data-steps="3" data-active-step="1"></div>');
    const { container } = render(<MobileStepper steps={3} defaultActiveStep={1} />);
    expectParity(container.firstElementChild, vanilla.firstElementChild, PARITY);
  });
});
