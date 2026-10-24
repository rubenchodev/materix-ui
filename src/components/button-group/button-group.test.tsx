import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectParity, mountVanilla } from '../../../tests/parity';
import { Button } from '../button';
import { ButtonGroup } from './index';

const PARITY = { classPrefixes: ['mtx-', 'material-'] };

describe('ButtonGroup', () => {
  it('outlined horizontal por defecto, role group y posiciones', () => {
    render(
      <ButtonGroup label="Options">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>,
    );
    const group = screen.getByRole('group', { name: 'Options' });
    expect(group).toHaveClass('mtx-button-group', 'mtx-button-group--outlined', 'mtx-button-group--horizontal');
    const buttons = screen.getAllByRole('button');
    buttons.forEach((b) => expect(b).toHaveClass('mtx-button', 'mtx-button--outlined', 'mtx-button-group__grouped'));
    expect(buttons[0]).toHaveClass('mtx-button-group__first');
    expect(buttons[1]).toHaveClass('mtx-button-group__middle');
    expect(buttons[2]).toHaveClass('mtx-button-group__last');
  });

  it('un único botón es first y last', () => {
    render(
      <ButtonGroup>
        <Button>Solo</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole('button')).toHaveClass('mtx-button-group__first', 'mtx-button-group__last');
  });

  it('hereda variante, tamaño, color y disableElevation; el hijo puede sobrescribir', () => {
    render(
      <ButtonGroup variant="contained" size="small" color="secondary" disableElevation>
        <Button>A</Button>
        <Button variant="text" color="error" size="large">B</Button>
      </ButtonGroup>,
    );
    const group = screen.getByRole('group');
    expect(group).toHaveClass('mtx-button-group--contained', 'mtx-button-group--small', 'mtx-button-group--secondary', 'mtx-button-group--disable-elevation');
    const [a, b] = screen.getAllByRole('button');
    expect(a).toHaveClass('mtx-button--contained', 'mtx-button--small', 'mtx-button--secondary', 'mtx-button--disable-elevation');
    expect(b).toHaveClass('mtx-button--text', 'mtx-button--large', 'mtx-button--error');
    expect(b).not.toHaveClass('mtx-button--contained');
    expect(b).not.toHaveClass('mtx-button--secondary');
  });

  it('vertical y fullWidth', () => {
    render(
      <ButtonGroup orientation="vertical" fullWidth>
        <Button>A</Button>
        <Button>B</Button>
      </ButtonGroup>,
    );
    const group = screen.getByRole('group');
    expect(group).toHaveClass('mtx-button-group--vertical', 'mtx-button-group--full-width');
    expect(group).not.toHaveAttribute('aria-orientation');
    screen.getAllByRole('button').forEach((b) => expect(b).toHaveClass('mtx-button--full-width'));
  });

  it('role toolbar vertical expone aria-orientation', () => {
    render(
      <ButtonGroup role="toolbar" orientation="vertical">
        <Button>A</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole('toolbar')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('disabled deshabilita todos los botones y marca el grupo', async () => {
    const onClick = vi.fn();
    const { rerender } = render(
      <ButtonGroup disabled>
        <Button onClick={onClick}>A</Button>
        <Button disabled>B</Button>
      </ButtonGroup>,
    );
    const group = screen.getByRole('group');
    expect(group).toHaveClass('mtx-button-group--disabled');
    expect(group).toHaveAttribute('aria-disabled', 'true');
    screen.getAllByRole('button').forEach((b) => expect(b).toBeDisabled());
    await userEvent.click(screen.getAllByRole('button')[0]);
    expect(onClick).not.toHaveBeenCalled();
    rerender(
      <ButtonGroup>
        <Button onClick={onClick}>A</Button>
        <Button disabled>B</Button>
      </ButtonGroup>,
    );
    const [a, b] = screen.getAllByRole('button');
    expect(a).not.toBeDisabled();
    expect(b).toBeDisabled();
  });

  it('ignora hijos no válidos y conserva ref y className', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ButtonGroup ref={ref} className="extra" aria-label="Formatting">
        {false}
        <Button>A</Button>
        {null}
        <Button>B</Button>
      </ButtonGroup>,
    );
    expect(ref.current).toHaveClass('mtx-button-group', 'extra');
    expect(ref.current).toHaveAttribute('aria-label', 'Formatting');
    const [a, b] = screen.getAllByRole('button');
    expect(a).toHaveClass('mtx-button-group__first');
    expect(b).toHaveClass('mtx-button-group__last');
  });

  it.each([
    [
      '<div data-mtx="button-group" data-variant="contained" data-label="Basic"><button>One</button><button>Two</button><button>Three</button></div>',
      <ButtonGroup key="1" variant="contained" label="Basic">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>,
    ],
    [
      '<div data-mtx="button-group" data-size="large" data-color="success" data-orientation="vertical" data-label="L"><button>One</button><button>Two</button></div>',
      <ButtonGroup key="2" size="large" color="success" orientation="vertical" label="L">
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>,
    ],
    [
      '<div data-mtx="button-group" data-variant="contained" data-label="Icons"><button data-start-icon="content_copy">Copy</button><button data-start-icon="content_cut">Cut</button></div>',
      <ButtonGroup key="3" variant="contained" label="Icons">
        <Button startIcon="content_copy">Copy</Button>
        <Button startIcon="content_cut">Cut</Button>
      </ButtonGroup>,
    ],
    [
      '<div data-mtx="button-group" data-variant="text" data-disabled data-full-width data-disable-elevation data-label="D"><button>One</button><button>Two</button></div>',
      <ButtonGroup key="4" variant="text" disabled fullWidth disableElevation label="D">
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>,
    ],
    [
      '<div data-mtx="button-group" data-label="Solo"><button>Solo</button></div>',
      <ButtonGroup key="5" label="Solo">
        <Button>Solo</Button>
      </ButtonGroup>,
    ],
  ])('paridad con vanilla: %s', async (html, element) => {
    const vanilla = await mountVanilla(html);
    const { container } = render(element);
    expectParity(container.firstElementChild, vanilla.firstElementChild, PARITY);
  });
});
