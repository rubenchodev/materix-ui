import { createRef, useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectParity, loadVanilla, mountVanilla } from '../../../tests/parity';
import { FormControl, FormHelperText } from '../form-helper-text';
import { Radio, RadioGroup } from './index';

describe('Radio', () => {
  it('renderiza label > input + caja + texto, sin aria-checked', () => {
    const { container } = render(<Radio value="a" label="A" name="x" />);
    const root = container.firstElementChild!;
    expect(root.tagName).toBe('LABEL');
    expect(root).toHaveClass('mtx-radio');
    const input = screen.getByRole('radio', { name: 'A' });
    expect(input).toHaveClass('mtx-radio__input');
    expect(input).not.toHaveAttribute('aria-checked');
    expect(root.querySelector('.mtx-radio__box')).not.toBeNull();
  });

  it('tamaño, color, className y ripple', () => {
    const { container } = render(<Radio value="a" label="A" size="small" color="error" className="x" />);
    const root = container.firstElementChild!;
    expect(root).toHaveClass('mtx-radio', 'mtx-radio--small', 'mtx-radio--error', 'x');
    fireEvent.pointerDown(root, { button: 0 });
    expect(root.querySelector('.mtx-radio__box > .mtx-ripple-container')).not.toBeNull();
  });

  it('suelto no controlado usa el comportamiento nativo', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Radio name="n" value="a" label="A" defaultChecked />
        <Radio name="n" value="b" label="B" />
      </>,
    );
    await user.click(screen.getByRole('radio', { name: 'B' }));
    expect(screen.getByRole('radio', { name: 'B' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'A' })).not.toBeChecked();
  });

  it('suelto dentro de FormControl: hereda aria-invalid y aria-describedby', () => {
    render(
      <FormControl error>
        <Radio name="s" value="a" label="A" />
        <FormHelperText>Pick one</FormHelperText>
      </FormControl>,
    );
    const radio = screen.getByRole('radio', { name: 'A' });
    expect(radio).toHaveAttribute('aria-invalid', 'true');
    expect(radio).toHaveAccessibleDescription('Pick one');
  });

  it('dentro de un RadioGroup el error va en el grupo, no en cada radio', () => {
    render(
      <RadioGroup label="G" error helperText="Err">
        <Radio value="a" label="A" />
      </RadioGroup>,
    );
    expect(screen.getByRole('radio')).not.toHaveAttribute('aria-invalid');
    expect(screen.getByRole('radio')).not.toHaveAttribute('aria-describedby');
  });

  it('ref al label', () => {
    const ref = createRef<HTMLLabelElement>();
    render(<Radio ref={ref} value="a" label="A" />);
    expect(ref.current).toHaveClass('mtx-radio');
  });
});

describe('RadioGroup', () => {
  it('role radiogroup, name automático y defaultValue', () => {
    render(
      <RadioGroup defaultValue="b" aria-label="Plan">
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>,
    );
    const group = screen.getByRole('radiogroup', { name: 'Plan' });
    expect(group).toHaveClass('mtx-radio-group');
    const [a, b] = screen.getAllByRole('radio') as HTMLInputElement[];
    expect(a.name).toBeTruthy();
    expect(a.name).toBe(b.name);
    expect(b).toBeChecked();
  });

  it('no controlado: cambia y llama a onChange(event, value)', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <RadioGroup name="plan" onChange={onChange} aria-label="Plan">
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>,
    );
    await user.click(screen.getByRole('radio', { name: 'B' }));
    expect(screen.getByRole('radio', { name: 'B' })).toBeChecked();
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), 'b');
    expect((screen.getByRole('radio', { name: 'A' }) as HTMLInputElement).name).toBe('plan');
  });

  it('controlado: el valor del padre manda', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState('a');
      return (
        <>
          <RadioGroup value={value} onChange={(_, v) => setValue(v)} aria-label="P">
            <Radio value="a" label="A" />
            <Radio value="b" label="B" />
          </RadioGroup>
          <button type="button" onClick={() => setValue('a')}>reset</button>
        </>
      );
    }
    render(<Controlled />);
    await user.click(screen.getByRole('radio', { name: 'B' }));
    expect(screen.getByRole('radio', { name: 'B' })).toBeChecked();
    await user.click(screen.getByRole('button', { name: 'reset' }));
    expect(screen.getByRole('radio', { name: 'A' })).toBeChecked();
  });

  it('teclado nativo: flechas mueven la selección', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <RadioGroup defaultValue="a" onChange={onChange} aria-label="K">
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>,
    );
    screen.getByRole('radio', { name: 'A' }).focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: 'B' })).toBeChecked();
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), 'b');
  });

  it('label: FormLabel enlazado con aria-labelledby; row', () => {
    const { container } = render(
      <RadioGroup label="Plan" row>
        <Radio value="a" label="A" />
      </RadioGroup>,
    );
    expect(container.firstElementChild).toHaveClass('mtx-form-control');
    expect(container.querySelector('.mtx-form-label')).toHaveTextContent('Plan');
    const group = screen.getByRole('radiogroup', { name: 'Plan' });
    expect(group).toHaveClass('mtx-radio-group--row');
  });

  it('error y helperText en el grupo', () => {
    const { container } = render(
      <RadioGroup label="Size" error helperText="Select one.">
        <Radio value="a" label="A" />
      </RadioGroup>,
    );
    const group = screen.getByRole('radiogroup');
    expect(group).toHaveAttribute('aria-invalid', 'true');
    expect(group).toHaveAccessibleDescription('Select one.');
    expect(container.firstElementChild).toHaveClass('mtx-form-control--error');
    expect(container.querySelector('.mtx-form-helper-text')).toHaveClass('mtx-form-helper-text--error');
  });

  it('conserva el foco al cambiar helperText de un grupo sin label', async () => {
    const user = userEvent.setup();
    function Dynamic() {
      const [value, setValue] = useState('a');
      return (
        <RadioGroup aria-label="F" value={value} onChange={(_, v) => setValue(v)} helperText={value === 'b' ? 'B chosen' : ''}>
          <Radio value="a" label="A" />
          <Radio value="b" label="B" />
        </RadioGroup>
      );
    }
    render(<Dynamic />);
    const a = screen.getByRole('radio', { name: 'A' });
    a.focus();
    await user.keyboard('{ArrowDown}');
    const b = screen.getByRole('radio', { name: 'B' });
    expect(b).toBeChecked();
    expect(b).toHaveFocus();
    expect(screen.getByRole('radiogroup')).toHaveAccessibleDescription('B chosen');
  });

  it('no controlado: form.reset() restaura defaultValue', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form>
        <RadioGroup aria-label="R" defaultValue="a">
          <Radio value="a" label="A" />
          <Radio value="b" label="B" />
        </RadioGroup>
      </form>,
    );
    await user.click(screen.getByRole('radio', { name: 'B' }));
    (container.querySelector('form') as HTMLFormElement).reset();
    expect(screen.getByRole('radio', { name: 'A' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'B' })).not.toBeChecked();
  });

  it('disabled deshabilita todos los radios', () => {
    render(
      <RadioGroup disabled aria-label="D">
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>,
    );
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-disabled', 'true');
    screen.getAllByRole('radio').forEach((radio) => expect(radio).toBeDisabled());
  });

  it('ref y className al radiogroup', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <RadioGroup ref={ref} className="extra" aria-label="R">
        <Radio value="a" label="A" />
      </RadioGroup>,
    );
    expect(ref.current).toBe(screen.getByRole('radiogroup'));
    expect(ref.current).toHaveClass('mtx-radio-group', 'extra');
  });
});

describe('Radio · paridad con vanilla', () => {
  it('radio suelto con color y tamaño', async () => {
    const vanilla = await mountVanilla(
      '<input type="radio" data-mtx="radio" name="p" value="a" data-label="A" data-size="small" data-color="secondary" checked />',
    );
    const { container } = render(<Radio name="p" value="a" label="A" size="small" color="secondary" defaultChecked />);
    expectParity(container.firstElementChild, vanilla.firstElementChild);
  });

  it('grupo con label y helperText', async () => {
    const vanilla = await mountVanilla(
      '<div data-mtx="radio-group" data-name="plan" data-label="Plan" data-helper-text="Later">' +
        '<input type="radio" data-mtx="radio" name="plan" value="a" data-label="A" checked />' +
        '<input type="radio" data-mtx="radio" name="plan" value="b" data-label="B" />' +
        '</div>',
    );
    const { container } = render(
      <RadioGroup name="plan" label="Plan" helperText="Later" defaultValue="a">
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>,
    );
    expectParity(container.firstElementChild, vanilla.firstElementChild);
  });

  it('grupo en fila con aria-label', async () => {
    const vanilla = await mountVanilla(
      '<div data-mtx="radio-group" data-name="s" data-row="true" aria-label="Size">' +
        '<input type="radio" data-mtx="radio" name="s" value="a" data-label="A" />' +
        '</div>',
    );
    const { container } = render(
      <RadioGroup name="s" row aria-label="Size">
        <Radio value="a" label="A" />
      </RadioGroup>,
    );
    // React envuelve siempre el grupo en un `.mtx-form-control` estable; el grupo coincide con vanilla.
    expect(container.firstElementChild).toHaveClass('mtx-form-control');
    expectParity(container.querySelector('.mtx-radio-group'), vanilla.firstElementChild);
  });

  it('grupo con error y mensaje', async () => {
    const vanilla = await mountVanilla(
      '<div data-mtx="radio-group" data-name="e" data-label="Q" data-error="Select an option.">' +
        '<input type="radio" data-mtx="radio" name="e" value="a" data-label="A" required />' +
        '</div>',
    );
    const { container } = render(
      <RadioGroup name="e" label="Q" error helperText="Select an option.">
        <Radio value="a" label="A" required />
      </RadioGroup>,
    );
    expectParity(container.firstElementChild, vanilla.firstElementChild);
  });

  it('grupo deshabilitado (equivale a disable())', async () => {
    const mtx = await loadVanilla();
    const vanilla = await mountVanilla(
      '<div data-mtx="radio-group" data-name="d" data-label="D" data-helper-text="H">' +
        '<input type="radio" data-mtx="radio" name="d" value="a" data-label="A" />' +
        '</div>',
    );
    const instance = mtx.getInstance(vanilla.querySelector('.mtx-radio-group')!) as unknown as { disable(): void };
    instance.disable();
    const { container } = render(
      <RadioGroup name="d" label="D" helperText="H" disabled>
        <Radio value="a" label="A" />
      </RadioGroup>,
    );
    expectParity(container.firstElementChild, vanilla.firstElementChild);
  });
});
