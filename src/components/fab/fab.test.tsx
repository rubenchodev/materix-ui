import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectParity, mountVanilla } from '../../../tests/parity';
import { Fab } from './index';

const withIcons = { classPrefixes: ['mtx-', 'material-'] };

describe('Fab', () => {
  it('renderiza un FAB circular por defecto (large, primary)', () => {
    render(<Fab icon="add" aria-label="Create" />);
    const fab = screen.getByRole('button', { name: 'Create' });
    expect(fab.className).toBe('mtx-fab');
    expect(fab).toHaveAttribute('type', 'button');
    expect(fab.querySelector('.material-icons')).toHaveAttribute('aria-hidden', 'true');
  });

  it('label lo convierte en extendido con el texto tras el icono', () => {
    render(<Fab icon="navigation" label="Navigate" />);
    const fab = screen.getByRole('button', { name: 'Navigate' });
    expect(fab).toHaveClass('mtx-fab--extended');
    const [icon, text] = Array.from(fab.children);
    expect(icon).toHaveClass('material-icons');
    expect(text.tagName).toBe('SPAN');
    expect(text).toHaveTextContent('Navigate');
  });

  it('variant="extended" con contenido propio', () => {
    render(
      <Fab variant="extended">
        <span className="material-icons" aria-hidden="true">
          add
        </span>
        <span>Create</span>
      </Fab>,
    );
    expect(screen.getByRole('button', { name: 'Create' })).toHaveClass('mtx-fab--extended');
  });

  it('aplica tamaños, colores y posiciones', () => {
    const { rerender } = render(<Fab icon="add" aria-label="Add" size="small" color="secondary" />);
    const fab = screen.getByRole('button');
    expect(fab).toHaveClass('mtx-fab--small', 'mtx-fab--secondary');
    rerender(<Fab icon="add" aria-label="Add" size="medium" color="default" position="fixed-br" />);
    expect(fab).toHaveClass('mtx-fab--medium', 'mtx-fab--default', 'mtx-fab--fixed-br');
    expect(fab).not.toHaveClass('mtx-fab--small');
    rerender(<Fab icon="add" aria-label="Add" position="absolute-center" />);
    expect(fab.className).toBe('mtx-fab mtx-fab--absolute-center');
  });

  it('concatena className, reenvía atributos y expone la ref', () => {
    const ref = createRef<HTMLElement>();
    render(<Fab ref={ref} icon="add" aria-label="Add" className="custom" id="f1" />);
    const fab = screen.getByRole('button');
    expect(fab).toHaveClass('mtx-fab', 'custom');
    expect(fab).toHaveAttribute('id', 'f1');
    expect(ref.current).toBe(fab);
  });

  it('teclado, disabled y ripple', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(<Fab icon="add" aria-label="Add" onClick={onClick} />);
    const fab = screen.getByRole('button');
    fab.focus();
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
    fireEvent.pointerDown(fab, { button: 0, clientX: 5, clientY: 5 });
    expect(fab.querySelector('.mtx-ripple-container > .mtx-ripple')).not.toBeNull();
    rerender(<Fab icon="add" aria-label="Add" onClick={onClick} disabled />);
    expect(fab).toBeDisabled();
    await user.click(fab);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('como enlace deshabilitado usa aria-disabled y bloquea la navegación', () => {
    const onClick = vi.fn();
    render(<Fab href="#top" icon="arrow_upward" aria-label="Top" disabled onClick={onClick} />);
    const link = screen.getByRole('link', { name: 'Top' });
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(link).toHaveAttribute('tabindex', '-1');
    fireEvent.click(link);
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe('Fab — paridad con vanilla', () => {
  it('circular con data-icon', async () => {
    const vanilla = await mountVanilla('<button data-mtx="fab" type="button" data-icon="add" aria-label="Create"></button>');
    const { container } = render(<Fab icon="add" aria-label="Create" />);
    expectParity(container.firstElementChild, vanilla.firstElementChild, withIcons);
  });

  it('extendido con data-label, tamaño y color', async () => {
    const vanilla = await mountVanilla(
      '<button data-mtx="fab" type="button" data-icon="edit" data-label="Edit" data-size="small" data-color="secondary"></button>',
    );
    const { container } = render(<Fab icon="edit" label="Edit" size="small" color="secondary" />);
    expectParity(container.firstElementChild, vanilla.firstElementChild, withIcons);
  });

  it('solo texto, disabled y posición', async () => {
    const vanilla = await mountVanilla(
      '<button data-mtx="fab" type="button" data-label="Continue" data-color="default" disabled></button>' +
        '<button data-mtx="fab" type="button" data-icon="add" data-size="medium" class="mtx-fab--absolute-center" aria-label="Create post"></button>',
    );
    const { container } = render(
      <>
        <Fab label="Continue" color="default" disabled />
        <Fab icon="add" size="medium" position="absolute-center" aria-label="Create post" />
      </>,
    );
    expectParity(container.children[0], vanilla.children[0], withIcons);
    expectParity(container.children[1], vanilla.children[1], withIcons);
  });
});
