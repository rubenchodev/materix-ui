import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createRef, useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { expectParity, mountVanilla } from '../../../tests/parity';
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
} from './index';
import type { AccordionGroupActions } from './index';

const PARITY = { classPrefixes: ['mtx-', 'material-'] };

/** Avanza los temporizadores de la transición de altura. */
function flushTransition() {
  act(() => {
    vi.runAllTimers();
  });
}

describe('Accordion', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('genera cabecera h3, botón y región (paridad con data-summary)', async () => {
    vi.useRealTimers();
    const vanilla = await mountVanilla('<div data-mtx="accordion" data-summary="Uno">Contenido</div>');
    const { container } = render(<Accordion summary="Uno">Contenido</Accordion>);
    expectParity(container.firstElementChild, vanilla.firstElementChild, PARITY);

    const button = container.querySelector('button')!;
    expect(button.parentElement?.tagName).toBe('H3');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    const region = container.querySelector('.mtx-accordion__region')!;
    expect(button.getAttribute('aria-controls')).toBe(region.id);
    expect(region.getAttribute('aria-labelledby')).toBe(button.id);
  });

  it('paridad: expandido, outlined, square, sin gutters, plain y elevación', async () => {
    vi.useRealTimers();
    const vanilla = await mountVanilla(
      '<div data-mtx="accordion" data-summary="A" data-expanded data-variant="outlined" data-square data-disable-gutters data-summary-style="plain" data-elevation="0" data-disabled>B</div>',
    );
    const { container } = render(
      <Accordion
        summary="A"
        defaultExpanded
        variant="outlined"
        square
        disableGutters
        summaryStyle="plain"
        elevation={0}
        disabled
      >
        B
      </Accordion>,
    );
    expectParity(container.firstElementChild, vanilla.firstElementChild, PARITY);
  });

  it('paridad: headingLevel, expandIcon y forma details', async () => {
    vi.useRealTimers();
    const vanilla = await mountVanilla(
      '<div data-mtx="accordion" data-summary="A" data-heading-level="none" data-expand-icon="add">B</div>' +
        '<div data-mtx="accordion" data-summary="C" data-heading-level="2" data-expand-icon="false">D</div>' +
        '<details data-mtx="accordion" open><summary>E</summary>F</details>',
    );
    const { container } = render(
      <>
        <Accordion summary="A" headingLevel="none" expandIcon="add">B</Accordion>
        <Accordion summary="C" headingLevel={2} expandIcon={false}>D</Accordion>
        <Accordion component="details" summary="E" defaultExpanded>F</Accordion>
      </>,
    );
    const r = container.children;
    const v = vanilla.children;
    expectParity(r[0], v[0], PARITY);
    expectParity(r[1], v[1], PARITY);
    expectParity(r[2], v[2], PARITY);
    expect(r[2].tagName).toBe('DETAILS');
    expect((r[2] as HTMLDetailsElement).open).toBe(true);
  });

  it('alterna con clic, llama a onChange y termina la transición', () => {
    const onChange = vi.fn();
    const { container } = render(<Accordion summary="Uno" duration={200} onChange={onChange}>Contenido</Accordion>);
    const root = container.firstElementChild!;
    const button = screen.getByRole('button', { name: 'Uno' });
    fireEvent.click(button);
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), true);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(root).toHaveClass('mtx-accordion--expanded');
    flushTransition();
    fireEvent.click(button);
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), false);
    expect(root).not.toHaveClass('mtx-accordion--expanded');
    flushTransition();
    const region = container.querySelector('.mtx-accordion__region') as HTMLElement;
    // Con `until-found` (jsdom expone `onbeforematch`) solo queda el hidden nativo, encontrable con Ctrl+F.
    expect(region).toHaveAttribute('hidden', 'until-found');
    expect(region.style.visibility).toBe('');
    expect(region.style.height).toBe('');
  });

  it('modo controlado: solo cambia con la prop', () => {
    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Accordion summary="Uno" expanded={open} onChange={(_, next) => setOpen(next)}>x</Accordion>
          <button type="button" onClick={() => setOpen(true)}>abrir</button>
        </>
      );
    }
    render(<Controlled />);
    fireEvent.click(screen.getByRole('button', { name: 'abrir' }));
    expect(screen.getByRole('button', { name: 'Uno' })).toHaveAttribute('aria-expanded', 'true');
    const fixed = vi.fn();
    render(<Accordion summary="Fijo" expanded={false} onChange={fixed}>y</Accordion>);
    fireEvent.click(screen.getByRole('button', { name: 'Fijo' }));
    expect(fixed).toHaveBeenCalledWith(expect.anything(), true);
    expect(screen.getByRole('button', { name: 'Fijo' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('deshabilitado: botón disabled y sin cambios; summary nativo con aria-disabled', () => {
    const onChange = vi.fn();
    const { container } = render(
      <>
        <Accordion summary="Uno" disabled onChange={onChange}>x</Accordion>
        <Accordion component="details" summary="Dos" disabled onChange={onChange}>y</Accordion>
      </>,
    );
    expect(screen.getByRole('button', { name: 'Uno' })).toBeDisabled();
    const summary = container.querySelector('summary')!;
    expect(summary).toHaveAttribute('aria-disabled', 'true');
    expect(summary).toHaveAttribute('tabindex', '-1');
    fireEvent.click(summary);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('details: el clic en summary no usa el toggle nativo y mantiene open hasta cerrar', () => {
    const { container } = render(<Accordion component="details" summary="Uno" duration={200}>x</Accordion>);
    const details = container.firstElementChild as HTMLDetailsElement;
    const summary = container.querySelector('summary')!;
    fireEvent.click(summary);
    expect(details.open).toBe(true);
    expect(summary).toHaveAttribute('aria-expanded', 'true');
    flushTransition();
    fireEvent.click(summary);
    expect(details.open).toBe(true);
    flushTransition();
    expect(details.open).toBe(false);
  });

  it('composición: AccordionSummary, AccordionDetails y AccordionActions al final de la región', () => {
    const ref = createRef<HTMLElement>();
    const { container } = render(
      <Accordion ref={ref} defaultExpanded>
        <AccordionActions disableSpacing>
          <button type="button">OK</button>
        </AccordionActions>
        <AccordionSummary secondary="detalle">Perfil</AccordionSummary>
        <AccordionDetails>Texto</AccordionDetails>
      </Accordion>,
    );
    expect(ref.current).toBe(container.firstElementChild);
    const region = container.querySelector('.mtx-accordion__region')!;
    expect(region.children[0]).toHaveClass('mtx-accordion__details');
    expect(region.children[1]).toHaveClass('mtx-accordion-actions', 'mtx-accordion-actions--disable-spacing');
    expect(container.querySelectorAll('.mtx-accordion__summary')).toHaveLength(1);
    expect(container.querySelector('.mtx-accordion__summary-secondary')).toHaveTextContent('detalle');
  });

  it('paridad: AccordionActions dentro de la región tras los detalles', async () => {
    vi.useRealTimers();
    const vanilla = await mountVanilla(
      '<div data-mtx="accordion" data-summary="A" data-expanded>Texto<div data-mtx="accordion-actions"><button type="button">OK</button></div></div>',
    );
    const { container } = render(
      <Accordion summary="A" defaultExpanded>
        Texto
        <AccordionActions>
          <button type="button">OK</button>
        </AccordionActions>
      </Accordion>,
    );
    expectParity(container.firstElementChild, vanilla.firstElementChild, PARITY);
  });

  it('ripple opcional en el resumen', () => {
    const { container } = render(<Accordion summary="Uno" ripple>x</Accordion>);
    const button = screen.getByRole('button', { name: 'Uno' });
    fireEvent.pointerDown(button, { button: 0, clientX: 5, clientY: 5 });
    expect(container.querySelector('.mtx-ripple-container, .mtx-ripple')).not.toBeNull();
  });

  it('beforematch (búsqueda en página) expande sin animación', () => {
    const onChange = vi.fn();
    const { container } = render(<Accordion summary="Uno" onChange={onChange}>x</Accordion>);
    const region = container.querySelector('.mtx-accordion__region') as HTMLElement;
    act(() => {
      region.dispatchEvent(new Event('beforematch'));
    });
    expect(onChange).toHaveBeenCalledWith(null, true);
    expect(container.querySelector('button')).toHaveAttribute('aria-expanded', 'true');
    expect(region.hasAttribute('hidden')).toBe(false);
  });

  it('duration fija y 0 sin animación', () => {
    const { container } = render(<Accordion summary="Uno" duration={0}>x</Accordion>);
    fireEvent.click(screen.getByRole('button', { name: 'Uno' }));
    const region = container.querySelector('.mtx-accordion__region') as HTMLElement;
    expect(region.style.visibility).toBe('');
  });
});

describe('AccordionGroup', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('exclusivo: un solo panel abierto (también al inicio)', () => {
    const onChange = vi.fn();
    render(
      <AccordionGroup>
        <Accordion summary="A" defaultExpanded onChange={onChange}>a</Accordion>
        <Accordion summary="B" defaultExpanded>b</Accordion>
        <Accordion summary="C">c</Accordion>
      </AccordionGroup>,
    );
    const [a, b, c] = ['A', 'B', 'C'].map((name) => screen.getByRole('button', { name }));
    expect(a).toHaveAttribute('aria-expanded', 'true');
    expect(b).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(c);
    expect(c).toHaveAttribute('aria-expanded', 'true');
    expect(a).toHaveAttribute('aria-expanded', 'false');
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), false);
  });

  it('exclusive={false} permite varios y actionRef expandAll/collapseAll', () => {
    const actions = createRef<AccordionGroupActions>();
    render(
      <AccordionGroup exclusive={false} actionRef={actions}>
        <Accordion summary="A" defaultExpanded>a</Accordion>
        <Accordion summary="B" defaultExpanded>b</Accordion>
        <Accordion summary="C" disabled>c</Accordion>
      </AccordionGroup>,
    );
    expect(screen.getByRole('button', { name: 'B' })).toHaveAttribute('aria-expanded', 'true');
    act(() => actions.current!.collapseAll());
    expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute('aria-expanded', 'false');
    act(() => actions.current!.expandAll());
    expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'C' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('hereda variante y opciones del grupo (paridad)', async () => {
    vi.useRealTimers();
    const vanilla = await mountVanilla(
      '<div data-mtx="accordion-group" data-variant="outlined" data-square data-summary-style="plain"><div data-mtx="accordion" data-summary="A">a</div></div>',
    );
    const { container } = render(
      <AccordionGroup variant="outlined" square summaryStyle="plain">
        <Accordion summary="A">a</Accordion>
      </AccordionGroup>,
    );
    expectParity(container.firstElementChild, vanilla.firstElementChild, PARITY);
  });

  it('flechas, Home y End mueven el foco saltando deshabilitados', () => {
    render(
      <AccordionGroup>
        <Accordion summary="A">a</Accordion>
        <Accordion summary="B" disabled>b</Accordion>
        <Accordion summary="C">c</Accordion>
        <Accordion summary="D">d</Accordion>
      </AccordionGroup>,
    );
    const [a, , c, d] = ['A', 'B', 'C', 'D'].map((name) => screen.getByRole('button', { name }));
    a.focus();
    fireEvent.keyDown(a, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(c);
    fireEvent.keyDown(c, { key: 'End' });
    expect(document.activeElement).toBe(d);
    fireEvent.keyDown(d, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(a);
    fireEvent.keyDown(a, { key: 'ArrowUp' });
    expect(document.activeElement).toBe(d);
    fireEvent.keyDown(d, { key: 'Home' });
    expect(document.activeElement).toBe(a);
  });

  it('un acordeón anidado no pertenece al grupo exterior', () => {
    render(
      <AccordionGroup>
        <Accordion summary="A" defaultExpanded>
          <Accordion summary="Interior">i</Accordion>
        </Accordion>
        <Accordion summary="B">b</Accordion>
      </AccordionGroup>,
    );
    const inner = screen.getByRole('button', { name: 'Interior' });
    fireEvent.click(inner);
    expect(inner).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute('aria-expanded', 'true');
    inner.focus();
    fireEvent.keyDown(inner, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(inner);
  });
});

describe('AccordionActions: orden de las hojas de estilo', () => {
  it.each(['Accordion.tsx', 'AccordionGroup.tsx'])(
    '%s importa button.css antes que accordion.css para conservar los 8px entre acciones',
    (file) => {
      const source = readFileSync(resolve(__dirname, file), 'utf8');
      const buttonCss = source.indexOf("import '@rubenchodev/materix-ui/components/button.css'");
      const accordionCss = source.indexOf("import '@rubenchodev/materix-ui/components/accordion.css'");
      expect(buttonCss).toBeGreaterThanOrEqual(0);
      expect(buttonCss).toBeLessThan(accordionCss);
    },
  );
});
