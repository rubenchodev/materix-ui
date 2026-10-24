import { createRef, useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectParity, loadVanilla, mountVanilla } from '../../../tests/parity';
import { FormControl } from '../form-helper-text';
import { Switch } from './index';

describe('Switch', () => {
  it('renderiza label > input[role=switch] + pista con thumb + texto', () => {
    const { container } = render(<Switch label="Wi-Fi" />);
    expect(container.firstElementChild).toHaveClass('mtx-form-control');
    const root = container.querySelector('label')!;
    expect(root.tagName).toBe('LABEL');
    expect(root).toHaveClass('mtx-switch');
    const input = screen.getByRole('switch', { name: 'Wi-Fi' });
    expect(input).toHaveClass('mtx-switch__input');
    expect(input).toHaveAttribute('type', 'checkbox');
    expect(input).not.toHaveAttribute('aria-checked');
    expect(root.querySelector('.mtx-switch__track > .mtx-switch__thumb')).not.toBeNull();
    expect(root.querySelector('.mtx-switch__label')).toHaveTextContent('Wi-Fi');
  });

  it('tamaño, color y className', () => {
    const { container } = render(<Switch label="X" size="small" color="info" className="extra" />);
    expect(container.querySelector('label')).toHaveClass('mtx-switch', 'mtx-switch--small', 'mtx-switch--info', 'extra');
  });

  it('no controlado con defaultChecked; clic y Espacio alternan', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch label="B" defaultChecked onChange={onChange} />);
    const input = screen.getByRole('switch');
    expect(input).toBeChecked();
    await user.click(input);
    expect(input).not.toBeChecked();
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), false);
    await user.keyboard(' ');
    expect(input).toBeChecked();
  });

  it('readOnly controlado: no avisa al padre', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch label="M" checked readOnly onChange={onChange} />);
    await user.click(screen.getByRole('switch'));
    expect(screen.getByRole('switch')).toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('conserva el foco al cambiar helperText', async () => {
    const user = userEvent.setup();
    function Dynamic() {
      const [on, setOn] = useState(false);
      return <Switch label="D" checked={on} onChange={(_, next) => setOn(next)} helperText={on ? 'Active' : undefined} />;
    }
    render(<Dynamic />);
    const input = screen.getByRole('switch');
    input.focus();
    await user.keyboard(' ');
    expect(screen.getByRole('switch')).toBe(input);
    expect(input).toHaveFocus();
  });

  it('no controlado: form.reset() restaura defaultChecked', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form>
        <Switch label="R" />
      </form>,
    );
    const input = screen.getByRole('switch');
    await user.click(input);
    expect(input).toBeChecked();
    (container.querySelector('form') as HTMLFormElement).reset();
    expect(input).not.toBeChecked();
  });

  it('controlado', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [on, setOn] = useState(false);
      return <Switch label="C" checked={on} onChange={(_, next) => setOn(next)} />;
    }
    render(<Controlled />);
    await user.click(screen.getByRole('switch'));
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('readOnly: no cambia ni llama a onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch label="Managed" defaultChecked readOnly onChange={onChange} />);
    const input = screen.getByRole('switch');
    await user.click(input);
    expect(input).toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('disabled y ripple en el thumb', () => {
    const { container, rerender } = render(<Switch label="R" />);
    fireEvent.pointerDown(container.querySelector('label')!, { button: 0 });
    expect(container.querySelector('.mtx-switch__thumb > .mtx-ripple-container')).not.toBeNull();
    rerender(<Switch label="R" disabled />);
    expect(screen.getByRole('switch')).toBeDisabled();
  });

  it('helperText y error', () => {
    const { container } = render(<Switch label="2FA" error helperText="Required." />);
    const wrapper = container.firstElementChild!;
    expect(wrapper).toHaveClass('mtx-form-control', 'mtx-form-control--error');
    const input = screen.getByRole('switch');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Required.');
  });

  it('hereda disabled de FormControl', () => {
    render(
      <FormControl disabled>
        <Switch label="F" />
      </FormControl>,
    );
    expect(screen.getByRole('switch')).toBeDisabled();
  });

  it('ref al label e inputRef al input', () => {
    const ref = createRef<HTMLLabelElement>();
    const inputRef = createRef<HTMLInputElement>();
    render(<Switch ref={ref} inputRef={inputRef} name="wifi" aria-label="Auto" />);
    expect(ref.current).toHaveClass('mtx-switch');
    expect(inputRef.current).toHaveAttribute('name', 'wifi');
  });
});

/** Vanilla dentro de un `.mtx-form-control` manual (React siempre renderiza ese contenedor estable). */
async function mountInFormControl(html: string, { disable = false } = {}) {
  const mtx = await loadVanilla();
  const vanilla = await mountVanilla(`<div class="mtx-form-control">${html}</div>`);
  if (disable) (mtx.getInstance(vanilla.querySelector('input')!) as unknown as { disable(): void }).disable();
  return vanilla.firstElementChild;
}

/** `aria-checked` se ignora: React deja el estado al input nativo (role="switch"). */
const OPTS = { ignoreAttributes: ['aria-checked'] };

describe('Switch · paridad con vanilla', () => {
  it('básico activado', async () => {
    const vanilla = await mountInFormControl('<input type="checkbox" data-mtx="switch" data-label="Wi-Fi" checked />');
    const { container } = render(<Switch label="Wi-Fi" defaultChecked />);
    expectParity(container.firstElementChild, vanilla, OPTS);
  });

  it('el <label> coincide con el vanilla sin contenedor', async () => {
    const vanilla = await mountVanilla('<input type="checkbox" data-mtx="switch" data-label="Plain" />');
    const { container } = render(<Switch label="Plain" />);
    expectParity(container.querySelector('.mtx-switch'), vanilla.firstElementChild, OPTS);
  });

  it('small + color + disabled (equivale a disable())', async () => {
    const vanilla = await mountInFormControl(
      '<input type="checkbox" data-mtx="switch" data-label="S" data-size="small" data-color="warning" />',
      { disable: true },
    );
    const { container } = render(<Switch label="S" size="small" color="warning" disabled />);
    expectParity(container.firstElementChild, vanilla, OPTS);
  });

  it('solo interruptor con aria-label', async () => {
    const vanilla = await mountInFormControl('<input type="checkbox" data-mtx="switch" aria-label="Sync" checked />');
    const { container } = render(<Switch aria-label="Sync" defaultChecked />);
    expectParity(container.firstElementChild, vanilla, OPTS);
  });

  it('helperText', async () => {
    const vanilla = await mountVanilla('<input type="checkbox" data-mtx="switch" data-label="B" data-helper-text="Nightly" />');
    const { container } = render(<Switch label="B" helperText="Nightly" />);
    expectParity(container.firstElementChild, vanilla.firstElementChild, OPTS);
  });

  it('error con mensaje', async () => {
    const vanilla = await mountVanilla('<input type="checkbox" data-mtx="switch" data-label="B" data-error="Required." />');
    const { container } = render(<Switch label="B" error helperText="Required." />);
    expectParity(container.firstElementChild, vanilla.firstElementChild, OPTS);
  });
});
