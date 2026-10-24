import { createRef, useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectParity, loadVanilla, mountVanilla } from '../../../tests/parity';
import { FormControl, FormHelperText } from '../form-helper-text';
import { Checkbox } from './index';
import { useHelperField } from './toggle-shared';

describe('Checkbox', () => {
  it('renderiza .mtx-form-control > label > input + caja + texto, sin aria-checked', () => {
    const { container } = render(<Checkbox label="Remember me" />);
    expect(container.firstElementChild).toHaveClass('mtx-form-control');
    const root = container.querySelector('label') as HTMLLabelElement;
    expect(root).toHaveClass('mtx-checkbox');
    const input = screen.getByRole('checkbox', { name: 'Remember me' });
    expect(input).toHaveClass('mtx-checkbox__input');
    expect(input).not.toHaveAttribute('aria-checked');
    expect(root.querySelector('.mtx-checkbox__box')).not.toBeNull();
    expect(root.querySelector('.mtx-checkbox__label')).toHaveTextContent('Remember me');
  });

  it('aplica tamaño, color y concatena className', () => {
    const { container } = render(<Checkbox label="X" size="small" color="secondary" className="extra" />);
    expect(container.querySelector('label')).toHaveClass('mtx-checkbox', 'mtx-checkbox--small', 'mtx-checkbox--secondary', 'extra');
    const { container: c2 } = render(<Checkbox label="Y" color="primary" />);
    expect(c2.querySelector('label')!.className).toBe('mtx-checkbox');
  });

  it('no controlado: alterna con clic y teclado y llama a onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox label="A" onChange={onChange} />);
    const input = screen.getByRole('checkbox');
    await user.click(input);
    expect(input).toBeChecked();
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), true);
    input.focus();
    await user.keyboard(' ');
    expect(input).not.toBeChecked();
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), false);
  });

  it('controlado: refleja el estado del padre', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [checked, setChecked] = useState(true);
      return (
        <>
          <Checkbox label="C" checked={checked} onChange={(_, next) => setChecked(next)} />
          <span data-testid="state">{String(checked)}</span>
        </>
      );
    }
    render(<Controlled />);
    const input = screen.getByRole('checkbox');
    expect(input).toBeChecked();
    await user.click(input);
    expect(input).not.toBeChecked();
    expect(screen.getByTestId('state')).toHaveTextContent('false');
  });

  it('controlado sin onChange no cambia', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Fixed" checked={false} onChange={() => {}} />);
    await user.click(screen.getByRole('checkbox'));
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('indeterminate: propiedad DOM y aria-checked="mixed"', () => {
    const { rerender } = render(<Checkbox label="All" indeterminate />);
    const input = screen.getByRole('checkbox') as HTMLInputElement;
    expect(input.indeterminate).toBe(true);
    expect(input).toHaveAttribute('aria-checked', 'mixed');
    rerender(<Checkbox label="All" indeterminate={false} defaultChecked />);
    expect(input.indeterminate).toBe(false);
  });

  it('disabled: input deshabilitado y sin ripple', () => {
    const { container } = render(<Checkbox label="D" disabled />);
    const input = screen.getByRole('checkbox');
    expect(input).toBeDisabled();
    fireEvent.pointerDown(container.querySelector('label')!, { button: 0 });
    expect(container.querySelector('.mtx-ripple-container')).toBeNull();
  });

  it('ripple centrado dentro de la caja al pulsar el label', () => {
    const { container } = render(<Checkbox label="R" />);
    fireEvent.pointerDown(container.querySelector('label')!, { button: 0, clientX: 2, clientY: 2 });
    expect(container.querySelector('.mtx-checkbox__box > .mtx-ripple-container')).not.toBeNull();
  });

  it('disableRipple desactiva el efecto', () => {
    const { container } = render(<Checkbox label="R" disableRipple />);
    fireEvent.pointerDown(container.querySelector('label')!, { button: 0 });
    expect(container.querySelector('.mtx-ripple-container')).toBeNull();
  });

  it('helperText: envuelve en .mtx-form-control y enlaza aria-describedby', () => {
    const { container } = render(<Checkbox label="Terms" helperText="Required" aria-describedby="extra" />);
    const wrapper = container.firstElementChild!;
    expect(wrapper).toHaveClass('mtx-form-control');
    const helper = wrapper.querySelector('.mtx-form-helper-text')!;
    expect(helper).toHaveTextContent('Required');
    const input = screen.getByRole('checkbox');
    expect(input.getAttribute('aria-describedby')).toBe(`extra ${helper.id}`);
    expect(input).toHaveAccessibleDescription('Required');
  });

  it('error: aria-invalid y clases de error; sin texto no hay <p>', () => {
    const { container, rerender } = render(<Checkbox label="E" error />);
    expect(container.firstElementChild).toHaveClass('mtx-form-control', 'mtx-form-control--error');
    expect(container.querySelector('.mtx-form-helper-text')).toBeNull();
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true');
    rerender(<Checkbox label="E" error helperText="Mandatory" />);
    expect(container.firstElementChild).toHaveClass('mtx-form-control', 'mtx-form-control--error');
    expect(container.querySelector('.mtx-form-helper-text')).toHaveClass('mtx-form-helper-text--error');
    rerender(<Checkbox label="E" helperText="Mandatory" />);
    expect(screen.getByRole('checkbox')).not.toHaveAttribute('aria-invalid');
  });

  it('hereda error y disabled de un FormControl externo y enlaza su FormHelperText', () => {
    render(
      <FormControl error disabled>
        <Checkbox label="Inside" />
        <FormHelperText>External help</FormHelperText>
      </FormControl>,
    );
    const input = screen.getByRole('checkbox');
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('External help');
  });

  it('ref al <label>, inputRef al input y atributos nativos en el input', () => {
    const ref = createRef<HTMLLabelElement>();
    const inputRef = createRef<HTMLInputElement>();
    render(
      <Checkbox ref={ref} inputRef={inputRef} label="N" name="news" value="yes" id="cb-1" required data-testid="root" />,
    );
    expect(ref.current).toBe(screen.getByTestId('root'));
    expect(inputRef.current).toBe(screen.getByRole('checkbox'));
    expect(inputRef.current).toHaveAttribute('name', 'news');
    expect(inputRef.current).toHaveAttribute('value', 'yes');
    expect(inputRef.current).toHaveAttribute('id', 'cb-1');
    expect(inputRef.current).toBeRequired();
  });

  it('aria-label nombra la casilla sin texto visible', () => {
    const { container } = render(<Checkbox aria-label="Select row 1" />);
    expect(screen.getByRole('checkbox', { name: 'Select row 1' })).toBeInTheDocument();
    expect(container.querySelector('.mtx-checkbox__label')).toBeNull();
  });
  it('el contenedor estable no tiene caja sin texto (layout de vanilla) y sí con texto', () => {
    const { container, rerender } = render(<Checkbox label="L" />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.display).toBe('contents');
    rerender(<Checkbox label="L" helperText="Help" />);
    expect(container.firstElementChild).toBe(wrapper);
    expect(wrapper.style.display).toBe('');
  });

  it('useHelperField con fullWidth estira el contenedor cuando hay texto', () => {
    function Field({ fullWidth, helperText }: { fullWidth?: boolean; helperText?: string }) {
      const { wrap } = useHelperField({ helperText, fullWidth });
      return <>{wrap(<div data-testid="control" />)}</>;
    }
    const { container, rerender } = render(<Field fullWidth />);
    expect((container.firstElementChild as HTMLElement).style.display).toBe('contents');
    rerender(<Field fullWidth helperText="Help" />);
    expect((container.firstElementChild as HTMLElement).style.width).toBe('100%');
    rerender(<Field helperText="Help" />);
    expect((container.firstElementChild as HTMLElement).style.width).toBe('');
  });

  it('conserva el foco y el nodo al cambiar helperText', async () => {
    const user = userEvent.setup();
    function Dynamic() {
      const [checked, setChecked] = useState(false);
      return <Checkbox label="D" checked={checked} onChange={(_, next) => setChecked(next)} helperText={checked ? 'ok' : ''} />;
    }
    render(<Dynamic />);
    const input = screen.getByRole('checkbox');
    input.focus();
    await user.keyboard(' ');
    expect(screen.getByRole('checkbox')).toBe(input);
    expect(input).toHaveFocus();
    expect(input).toHaveAccessibleDescription('ok');
    await user.keyboard(' ');
    expect(screen.getByRole('checkbox')).toBe(input);
    expect(input).toHaveFocus();
  });

  it('no controlado: form.reset() restaura defaultChecked', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form>
        <Checkbox label="R" defaultChecked />
      </form>,
    );
    const input = screen.getByRole('checkbox');
    await user.click(input);
    expect(input).not.toBeChecked();
    (container.querySelector('form') as HTMLFormElement).reset();
    expect(input).toBeChecked();
    await user.click(input);
    expect(input).not.toBeChecked();
  });

  it('dentro de un FormControl, el helper de cada casilla solo la describe a ella', () => {
    render(
      <FormControl>
        <Checkbox label="A" helperText="Help A" />
        <Checkbox label="B" helperText="Help B" />
        <Checkbox label="C" />
      </FormControl>,
    );
    expect(screen.getByRole('checkbox', { name: 'A' })).toHaveAccessibleDescription('Help A');
    expect(screen.getByRole('checkbox', { name: 'B' })).toHaveAccessibleDescription('Help B');
    expect(screen.getByRole('checkbox', { name: 'C' })).not.toHaveAttribute('aria-describedby');
  });
});

/**
 * Monta el vanilla dentro de un `.mtx-form-control` manual: React siempre renderiza ese contenedor estable
 * (para no remontar el input al cambiar `helperText`), y vanilla lo reutiliza igual que el que genera.
 * `aria-checked` se ignora: React deja el estado al checkbox nativo y solo pone `aria-checked="mixed"`.
 */
async function mountInFormControl(html: string, { disable = false } = {}) {
  const mtx = await loadVanilla();
  const vanilla = await mountVanilla(`<div class="mtx-form-control">${html}</div>`);
  if (disable) (mtx.getInstance(vanilla.querySelector('input')!) as unknown as { disable(): void }).disable();
  return vanilla.firstElementChild;
}

const OPTS = { ignoreAttributes: ['aria-checked'] };

describe('Checkbox · paridad con vanilla', () => {
  it('básico con label y checked', async () => {
    const vanilla = await mountInFormControl('<input type="checkbox" data-mtx="checkbox" data-label="Remember me" checked />');
    const { container } = render(<Checkbox label="Remember me" defaultChecked />);
    expectParity(container.firstElementChild, vanilla, OPTS);
  });

  it('small + color + disabled (equivale a disable())', async () => {
    const vanilla = await mountInFormControl(
      '<input type="checkbox" data-mtx="checkbox" data-label="S" data-size="small" data-color="success" />',
      { disable: true },
    );
    const { container } = render(<Checkbox label="S" size="small" color="success" disabled />);
    expectParity(container.firstElementChild, vanilla, OPTS);
  });

  it('solo caja con aria-label', async () => {
    const vanilla = await mountInFormControl('<input type="checkbox" data-mtx="checkbox" aria-label="Row" />');
    const { container } = render(<Checkbox aria-label="Row" />);
    expectParity(container.firstElementChild, vanilla, OPTS);
  });

  it('el <label> coincide con el vanilla sin contenedor', async () => {
    const vanilla = await mountVanilla('<input type="checkbox" data-mtx="checkbox" data-label="Plain" />');
    const { container } = render(<Checkbox label="Plain" />);
    expectParity(container.querySelector('.mtx-checkbox'), vanilla.firstElementChild, OPTS);
  });

  it('indeterminado (aria-checked="mixed")', async () => {
    const vanilla = await mountInFormControl('<input type="checkbox" data-mtx="checkbox" data-label="All" data-indeterminate />');
    const { container } = render(<Checkbox label="All" indeterminate />);
    expectParity(container.firstElementChild, vanilla);
  });

  it('helperText (igual que el contenedor generado por vanilla)', async () => {
    const vanilla = await mountVanilla('<input type="checkbox" data-mtx="checkbox" data-label="T" data-helper-text="Help" />');
    const { container } = render(<Checkbox label="T" helperText="Help" />);
    expectParity(container.firstElementChild, vanilla.firstElementChild, OPTS);
  });

  it('error con mensaje', async () => {
    const vanilla = await mountVanilla('<input type="checkbox" data-mtx="checkbox" data-label="T" data-error="Accept it." />');
    const { container } = render(<Checkbox label="T" error helperText="Accept it." />);
    expectParity(container.firstElementChild, vanilla.firstElementChild, OPTS);
  });

  it('error sin mensaje', async () => {
    const vanilla = await mountInFormControl('<input type="checkbox" data-mtx="checkbox" data-label="T" data-error />');
    const { container } = render(<Checkbox label="T" error />);
    expectParity(container.firstElementChild, vanilla, OPTS);
  });

  it('deshabilitado con helper (equivale a disable())', async () => {
    const vanilla = await mountInFormControl('<input type="checkbox" data-mtx="checkbox" data-label="T" data-helper-text="Help" />', {
      disable: true,
    });
    const { container } = render(<Checkbox label="T" helperText="Help" disabled />);
    expectParity(container.firstElementChild, vanilla, OPTS);
  });
});
