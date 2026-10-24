import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectParity, mountVanilla } from '../../../tests/parity';
import { IconButton } from './index';

const withIcons = { classPrefixes: ['mtx-', 'material-'] };

describe('IconButton', () => {
  it('renderiza un <button type="button"> con el icono decorativo', () => {
    render(<IconButton icon="search" aria-label="Search" />);
    const button = screen.getByRole('button', { name: 'Search' });
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass('mtx-icon-button');
    const icon = button.querySelector('.material-icons');
    expect(icon).toHaveTextContent('search');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('aplica tamaños, colores y edge', () => {
    const { rerender } = render(<IconButton icon="edit" aria-label="Edit" />);
    const button = screen.getByRole('button');
    expect(button.className).toBe('mtx-icon-button');
    rerender(<IconButton icon="edit" aria-label="Edit" size="large" color="primary" edge="start" />);
    expect(button).toHaveClass('mtx-icon-button--large', 'mtx-icon-button--primary', 'mtx-icon-button--edge-start');
    rerender(<IconButton icon="edit" aria-label="Edit" size="small" color="inherit" edge="end" />);
    expect(button).toHaveClass('mtx-icon-button--small', 'mtx-icon-button--inherit', 'mtx-icon-button--edge-end');
    expect(button).not.toHaveClass('mtx-icon-button--large');
  });

  it('children tiene prioridad sobre icon y acepta un ReactNode como icono', () => {
    const { rerender } = render(
      <IconButton icon="search" aria-label="Print">
        <span className="material-icons">print</span>
      </IconButton>,
    );
    expect(screen.getByRole('button')).toHaveTextContent('print');
    expect(screen.getByRole('button')).not.toHaveTextContent('search');
    rerender(<IconButton icon={<svg data-testid="svg" aria-hidden="true" />} aria-label="GitHub" />);
    expect(screen.getByTestId('svg')).toBeInTheDocument();
  });

  it('concatena className, reenvía atributos y expone la ref', () => {
    const ref = createRef<HTMLElement>();
    render(<IconButton ref={ref} icon="star" aria-label="Star" className="custom" id="ib" data-x="1" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('mtx-icon-button', 'custom');
    expect(button).toHaveAttribute('id', 'ib');
    expect(button).toHaveAttribute('data-x', '1');
    expect(ref.current).toBe(button);
  });

  it('dispara onClick con el teclado y no cuando está deshabilitado', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(<IconButton icon="star" aria-label="Star" onClick={onClick} />);
    screen.getByRole('button').focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(2);
    rerender(<IconButton icon="star" aria-label="Star" onClick={onClick} disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('crea un ripple centrado en pointerdown y no lo crea si está deshabilitado', () => {
    const onPointerDown = vi.fn();
    const { rerender } = render(<IconButton icon="star" aria-label="Star" onPointerDown={onPointerDown} />);
    const button = screen.getByRole('button');
    fireEvent.pointerDown(button, { button: 0, clientX: 3, clientY: 3 });
    expect(onPointerDown).toHaveBeenCalled();
    expect(button.querySelector('.mtx-ripple-container > .mtx-ripple')).not.toBeNull();
    rerender(<IconButton icon="star" aria-label="Star" disabled />);
    fireEvent.pointerUp(button);
    const count = button.querySelectorAll('.mtx-ripple').length;
    fireEvent.pointerDown(button, { button: 0 });
    expect(button.querySelectorAll('.mtx-ripple').length).toBe(count);
  });

  it('con href renderiza un enlace; deshabilitado usa aria-disabled y bloquea el clic', async () => {
    const onClick = vi.fn();
    const { rerender } = render(<IconButton href="#x" icon="link" aria-label="Link" onClick={onClick} />);
    const link = screen.getByRole('link', { name: 'Link' });
    expect(link.tagName).toBe('A');
    expect(link).not.toHaveAttribute('type');
    rerender(<IconButton href="#x" icon="link" aria-label="Link" onClick={onClick} disabled />);
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(link).toHaveAttribute('tabindex', '-1');
    fireEvent.click(link);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('acepta un componente raíz personalizado', () => {
    render(<IconButton component="span" role="button" icon="star" aria-label="Star" />);
    expect(screen.getByRole('button').tagName).toBe('SPAN');
  });
});

describe('IconButton — paridad con vanilla', () => {
  it('data-icon básico', async () => {
    const vanilla = await mountVanilla(
      '<button data-mtx="icon-button" type="button" data-icon="search" aria-label="Search"></button>',
    );
    const { container } = render(<IconButton icon="search" aria-label="Search" />);
    expectParity(container.firstElementChild, vanilla.firstElementChild, withIcons);
  });

  it('tamaño, color, edge y disabled', async () => {
    const vanilla = await mountVanilla(
      '<button data-mtx="icon-button" type="button" data-icon="menu" data-size="large" data-color="inherit" data-edge="start" aria-label="Menu" disabled></button>',
    );
    const { container } = render(
      <IconButton icon="menu" size="large" color="inherit" edge="start" aria-label="Menu" disabled />,
    );
    expectParity(container.firstElementChild, vanilla.firstElementChild, withIcons);
  });

  it('icono anidado y enlace', async () => {
    const vanilla = await mountVanilla(
      '<button data-mtx="icon-button" type="button" data-size="small" data-color="error" aria-label="Delete"><span class="material-icons" aria-hidden="true">delete</span></button>' +
        '<a href="#icons" data-mtx="icon-button" data-icon="link" aria-label="Link"></a>',
    );
    const { container } = render(
      <>
        <IconButton size="small" color="error" aria-label="Delete">
          <span className="material-icons" aria-hidden="true">
            delete
          </span>
        </IconButton>
        <IconButton href="#icons" icon="link" aria-label="Link" />
      </>,
    );
    expectParity(container.children[0], vanilla.children[0], withIcons);
    expectParity(container.children[1], vanilla.children[1], { ...withIcons, attributes: ['href'] });
  });

  it('el ripple vive en .mtx-ripple-container como en vanilla', async () => {
    const vanilla = await mountVanilla('<button data-mtx="icon-button" data-icon="star" aria-label="Star"></button>');
    const vanillaButton = vanilla.firstElementChild as HTMLButtonElement;
    vanillaButton.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, clientX: 4, clientY: 4 }));
    const { container } = render(<IconButton icon="star" aria-label="Star" />);
    const button = container.firstElementChild as HTMLButtonElement;
    fireEvent.pointerDown(button, { button: 0, clientX: 4, clientY: 4 });
    expect(vanillaButton.querySelector('.mtx-ripple-container > .mtx-ripple')).not.toBeNull();
    expect(button.querySelector('.mtx-ripple-container > .mtx-ripple')).not.toBeNull();
  });
});
