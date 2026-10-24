import { createRef, forwardRef } from 'react';
import type { AnchorHTMLAttributes } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectParity, mountVanilla } from '../../../tests/parity';
import { Button } from './index';

const PARITY = { classPrefixes: ['mtx-', 'material-'] };

describe('Button', () => {
  it('render por defecto: <button type="button"> variante text', () => {
    render(<Button>Save</Button>);
    const btn = screen.getByRole('button', { name: 'Save' });
    expect(btn.tagName).toBe('BUTTON');
    expect(btn).toHaveAttribute('type', 'button');
    expect(btn).toHaveClass('mtx-button', 'mtx-button--text');
  });

  it('variantes, tamaños, colores y modificadores', () => {
    render(
      <Button variant="contained" size="large" color="error" fullWidth disableElevation uppercase surface="primary" iconOnly aria-label="Star">
        x
      </Button>,
    );
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass(
      'mtx-button--contained',
      'mtx-button--large',
      'mtx-button--error',
      'mtx-button--full-width',
      'mtx-button--disable-elevation',
      'mtx-button--uppercase',
      'mtx-button--on-primary',
      'mtx-button--icon',
    );
  });

  it('medium y primary no añaden modificador', () => {
    render(<Button variant="outlined" size="medium" color="primary">A</Button>);
    expect(screen.getByRole('button').className).toBe('mtx-button mtx-button--outlined');
  });

  it('startIcon/endIcon como nombre o nodo', () => {
    render(
      <Button startIcon="add" endIcon={<svg data-testid="svg" />}>
        New
      </Button>,
    );
    const btn = screen.getByRole('button', { name: 'New' });
    const [start, end] = Array.from(btn.querySelectorAll(':scope > .mtx-button__icon'));
    expect(start.className).toBe('mtx-button__icon mtx-button__icon--start material-icons');
    expect(start).toHaveTextContent('add');
    expect(end).toHaveClass('mtx-button__icon--end');
    expect(end).not.toHaveClass('material-icons');
    expect(end).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByTestId('svg')).toBeInTheDocument();
  });

  it('disabled nativo bloquea el click y el ripple', async () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>A</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
    fireEvent.pointerDown(btn, { button: 0, clientX: 4, clientY: 4 });
    expect(btn.querySelector('.mtx-ripple')).toBeNull();
  });

  it('ripple en pointerdown', () => {
    render(<Button>A</Button>);
    const btn = screen.getByRole('button');
    fireEvent.pointerDown(btn, { button: 0, clientX: 4, clientY: 4 });
    expect(btn.querySelector('.mtx-ripple-container .mtx-ripple')).not.toBeNull();
  });

  it('href renderiza <a>; deshabilitado usa aria-disabled, tabindex -1 y bloquea la navegación', () => {
    const onClick = vi.fn();
    const { rerender } = render(<Button href="#x" target="_blank">Go</Button>);
    let link = screen.getByRole('link', { name: 'Go' });
    expect(link).toHaveAttribute('href', '#x');
    expect(link).not.toHaveAttribute('type');
    expect(link).not.toHaveAttribute('tabindex');
    rerender(<Button href="#x" disabled onClick={onClick}>Go</Button>);
    link = screen.getByRole('link', { name: 'Go' });
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(link).toHaveAttribute('tabindex', '-1');
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    link.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('component polimórfico: elemento sin semántica recibe role y teclado', async () => {
    const onClick = vi.fn();
    render(<Button component="span" onClick={onClick}>Span</Button>);
    const el = screen.getByRole('button', { name: 'Span' });
    expect(el.tagName).toBe('SPAN');
    expect(el).toHaveAttribute('tabindex', '0');
    el.focus();
    await userEvent.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('component personalizado recibe href', () => {
    const RouterLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>((props, ref) => (
      <a ref={ref} data-router="" {...props} />
    ));
    render(<Button component={RouterLink} href="/plans">Plans</Button>);
    const link = screen.getByRole('link', { name: 'Plans' });
    expect(link).toHaveAttribute('data-router');
    expect(link).toHaveClass('mtx-button');
  });

  it('ref y className concatenado', () => {
    const ref = createRef<HTMLElement>();
    render(<Button ref={ref} className="extra" variant="contained">A</Button>);
    expect(ref.current).toBe(screen.getByRole('button'));
    expect(ref.current).toHaveClass('mtx-button', 'mtx-button--contained', 'extra');
  });

  it('acepta type="submit"', () => {
    render(<Button type="submit">Send</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });
});

describe('Button loading', () => {
  it('center: deshabilita, aria-busy y spinner decorativo de 16px', () => {
    render(<Button variant="contained" loading>Save</Button>);
    const btn = screen.getByRole('button', { name: 'Save' });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(btn).toHaveClass('mtx-button--loading', 'mtx-button--loading-center');
    const indicator = btn.querySelector('.mtx-button__loading-indicator--center')!;
    expect(indicator).toHaveAttribute('aria-hidden', 'true');
    const spinner = indicator.querySelector('.mtx-circular-progress') as HTMLElement;
    expect(spinner).toHaveClass('mtx-circular-progress--inherit');
    expect(spinner).not.toHaveAttribute('role');
    expect(spinner.style.getPropertyValue('--mtx-circular-progress-size')).toBe('16px');
    expect(btn.lastElementChild).toBe(indicator);
  });

  it('start sustituye el icono inicial y hereda su desplazamiento', () => {
    render(<Button loading loadingPosition="start" startIcon="save">Save</Button>);
    const btn = screen.getByRole('button');
    const icon = btn.querySelector('.mtx-button__icon.material-icons')!;
    const indicator = btn.querySelector('.mtx-button__loading-indicator')!;
    expect(indicator.nextElementSibling).toBe(icon);
    expect(icon).toHaveClass('mtx-button__icon--loading-hidden');
    expect(indicator).toHaveClass('mtx-button__icon--start', 'mtx-button__loading-indicator--start');
  });

  it('end sustituye el icono final', () => {
    render(<Button loading loadingPosition="end" endIcon="send">Send</Button>);
    const btn = screen.getByRole('button');
    expect(btn.querySelector('.mtx-button__icon--end')).toHaveClass('mtx-button__icon--loading-hidden');
    expect(btn.lastElementChild).toHaveClass('mtx-button__loading-indicator--end', 'mtx-button__icon--end');
  });

  it('loadingIndicator de texto sustituye el spinner', () => {
    render(<Button loading loadingIndicator="Loading…">Pay</Button>);
    const indicator = screen.getByRole('button').querySelector('.mtx-button__loading-indicator')!;
    expect(indicator).toHaveClass('mtx-button__loading-indicator--text');
    expect(indicator).toHaveTextContent('Loading…');
    expect(indicator.querySelector('.mtx-circular-progress')).toBeNull();
  });

  it('al terminar la carga restaura el estado', () => {
    const { rerender } = render(<Button loading>Save</Button>);
    rerender(<Button>Save</Button>);
    const btn = screen.getByRole('button');
    expect(btn).not.toBeDisabled();
    expect(btn).not.toHaveAttribute('aria-busy');
    expect(btn.className).toBe('mtx-button mtx-button--text');
  });

  it('en <a> usa aria-disabled durante la carga', () => {
    render(<Button href="#x" loading>Go</Button>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(link).toHaveAttribute('tabindex', '-1');
  });
});

describe('Button — paridad con vanilla', () => {
  it.each([
    ['<button type="button" class="mtx-button mtx-button--contained" data-mtx="button">Save</button>', <Button key="1" variant="contained">Save</Button>],
    [
      '<button type="button" class="mtx-button mtx-button--outlined" data-mtx="button" data-size="small" data-color="error" data-start-icon="delete">Delete</button>',
      <Button key="2" variant="outlined" size="small" color="error" startIcon="delete">Delete</Button>,
    ],
    [
      '<button type="button" class="mtx-button mtx-button--contained" data-mtx="button" data-size="large" data-start-icon="save" data-end-icon="expand_more">Large</button>',
      <Button key="3" variant="contained" size="large" startIcon="save" endIcon="expand_more">Large</Button>,
    ],
    ['<button type="button" class="mtx-button mtx-button--text" data-mtx="button" disabled>Text</button>', <Button key="4" variant="text" disabled>Text</Button>],
    [
      '<button type="button" class="mtx-button mtx-button--contained" data-mtx="button" data-surface="primary">Start</button>',
      <Button key="5" variant="contained" surface="primary">Start</Button>,
    ],
    [
      '<a class="mtx-button mtx-button--outlined" data-mtx="button" href="#x" data-end-icon="arrow_forward">Next</a>',
      <Button key="6" variant="outlined" href="#x" endIcon="arrow_forward">Next</Button>,
    ],
    ['<button type="button" class="mtx-button mtx-button--contained" data-mtx="button" data-loading>Save</button>', <Button key="7" variant="contained" loading>Save</Button>],
    [
      '<button type="button" class="mtx-button mtx-button--outlined" data-mtx="button" data-loading data-loading-position="start" data-start-icon="save">Save</button>',
      <Button key="8" variant="outlined" loading loadingPosition="start" startIcon="save">Save</Button>,
    ],
    [
      '<button type="button" class="mtx-button mtx-button--text" data-mtx="button" data-loading data-loading-position="end" data-end-icon="send">Send</button>',
      <Button key="9" variant="text" loading loadingPosition="end" endIcon="send">Send</Button>,
    ],
    [
      '<button type="button" class="mtx-button mtx-button--outlined" data-mtx="button" data-loading data-loading-indicator="Loading…">Download</button>',
      <Button key="10" variant="outlined" loading loadingIndicator="Loading…">Download</Button>,
    ],
    [
      '<a class="mtx-button mtx-button--contained" data-mtx="button" href="#x" data-loading>Go</a>',
      <Button key="11" variant="contained" href="#x" loading>Go</Button>,
    ],
  ])('%s', async (html, element) => {
    const vanilla = await mountVanilla(html);
    const { container } = render(element);
    expectParity(container.firstElementChild, vanilla.firstElementChild, PARITY);
  });
});
