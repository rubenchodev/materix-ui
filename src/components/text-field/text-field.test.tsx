import { createRef, useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectParity, mountVanilla } from '../../../tests/parity';
import { I18nProvider } from '../../i18n';
import { FormControl, FormHelperText } from '../form-helper-text';
import { TextField } from './index';

/** Raíz `.mtx-text-field` de un render. */
const rootOf = (container: HTMLElement) => container.querySelector('.mtx-text-field') as HTMLDivElement;

describe('TextField', () => {
  it('renderiza label, contenedor, input y NotchedOutline (outlined por defecto)', () => {
    const { container } = render(<TextField label="Full name" />);
    const root = rootOf(container);
    expect(root).toHaveClass('mtx-text-field', 'mtx-text-field--outlined');
    const input = screen.getByLabelText('Full name');
    expect(input).toHaveClass('mtx-text-field__input');
    expect(input).toHaveAttribute('placeholder', ' ');
    expect(input).toHaveAttribute('type', 'text');
    expect(root.querySelector('.mtx-text-field__label')).toHaveAttribute('for', input.id);
    const outline = root.querySelector('fieldset.mtx-text-field__outline')!;
    expect(outline).toHaveAttribute('aria-hidden', 'true');
    expect(outline.querySelector('.mtx-text-field__legend > span')).toHaveTextContent('Full name');
    expect(root).not.toHaveClass('mtx-text-field--has-value');
  });

  it('paridad con vanilla: outlined básico', async () => {
    const vanilla = await mountVanilla('<input data-mtx="text-field" data-label="Full name" type="text" />');
    const { container } = render(<TextField label="Full name" />);
    expectParity(rootOf(container), vanilla.querySelector('.mtx-text-field'));
  });

  it('paridad con vanilla: filled pequeño con icono inicial y helper', async () => {
    const vanilla = await mountVanilla(
      '<input data-mtx="text-field" data-label="Email" data-variant="filled" data-size="small" data-start-icon="email" data-helper-text="Work email" type="email" />',
    );
    const { container } = render(<TextField label="Email" variant="filled" size="small" startIcon="email" helperText="Work email" type="email" />);
    expectParity(rootOf(container), vanilla.querySelector('.mtx-text-field'));
  });

  it('paridad con vanilla: contraseña con toggle, imagen inicial y contador', async () => {
    const vanilla = await mountVanilla(
      '<input data-mtx="text-field" data-label="PIN" data-start-icon="https://flagcdn.com/w20/co.png" type="password" data-password-toggle maxlength="6" />',
    );
    const { container } = render(<TextField label="PIN" startIcon="https://flagcdn.com/w20/co.png" type="password" passwordToggle maxLength={6} />);
    expectParity(rootOf(container), vanilla.querySelector('.mtx-text-field'));
  });

  it('paridad con vanilla: acción final, standard y no-label', async () => {
    const vanilla = await mountVanilla(`
      <input data-mtx="text-field" data-label="Search" data-variant="standard" data-end-action="close" data-end-action-label="Clear" type="search" />
      <input data-mtx="text-field" data-variant="no-label" data-start-icon="search" placeholder="Search…" aria-label="Search" type="search" />`);
    const { container } = render(
      <>
        <TextField label="Search" variant="standard" endAction="close" endActionLabel="Clear" type="search" />
        <TextField variant="no-label" startIcon="search" placeholder="Search…" aria-label="Search" type="search" />
      </>,
    );
    const react = container.querySelectorAll('.mtx-text-field');
    const van = vanilla.querySelectorAll('.mtx-text-field');
    expectParity(react[0], van[0]);
    expectParity(react[1], van[1]);
  });

  it('paridad con vanilla: select, multiline con auto-resize y contador both', async () => {
    const vanilla = await mountVanilla(`
      <select data-mtx="text-field" data-label="Country"><option>Spain</option><option>Chile</option></select>
      <textarea data-mtx="text-field" data-label="Bio" data-auto-resize data-counter="both" data-max-words="10" data-max-chars="100" rows="2"></textarea>`);
    const { container } = render(
      <>
        <TextField select label="Country">
          <option>Spain</option>
          <option>Chile</option>
        </TextField>
        <TextField multiline label="Bio" autoResize counter="both" maxWords={10} maxChars={100} rows={2} />
      </>,
    );
    const react = container.querySelectorAll('.mtx-text-field');
    const van = vanilla.querySelectorAll('.mtx-text-field');
    expectParity(react[0], van[0]);
    expectParity(react[1], van[1]);
  });

  it('variantes, tamaños, colores, margen, ancho completo y className concatenado', () => {
    const { container } = render(
      <>
        <TextField label="A" variant="filled" size="large" color="secondary" margin="dense" fullWidth className="extra" />
        <TextField label="B" variant="standard" size="small" />
        <TextField label="C" variant="no-label" staticLabel hiddenLabel borderless />
      </>,
    );
    const [a, b, c] = Array.from(container.querySelectorAll('.mtx-text-field'));
    expect(a).toHaveClass('mtx-text-field--filled', 'mtx-text-field--large', 'mtx-text-field--secondary', 'mtx-text-field--margin-dense', 'mtx-text-field--full-width', 'extra');
    expect(a.querySelector('fieldset')).toBeNull();
    expect(b).toHaveClass('mtx-text-field--standard', 'mtx-text-field--small');
    expect(c).toHaveClass('mtx-text-field--outlined', 'mtx-text-field--no-label', 'mtx-text-field--static-label', 'mtx-text-field--hidden-label', 'mtx-text-field--borderless');
    // Label oculto: borde completo sin muesca.
    expect(c.querySelector('fieldset')).not.toBeNull();
    expect(c.querySelector('legend')).toBeNull();
  });

  it('usa el placeholder como label si falta label (como vanilla)', () => {
    render(<TextField placeholder="Email" type="email" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('placeholder', ' ');
  });

  it('no controlado: sincroniza --has-value y llama a onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(<TextField label="Name" onChange={onChange} />);
    const input = screen.getByLabelText('Name');
    await user.type(input, 'Hi');
    expect(rootOf(container)).toHaveClass('mtx-text-field--has-value');
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), 'Hi', { unmaskedValue: 'Hi', isMaskComplete: true });
    await user.clear(input);
    expect(rootOf(container)).not.toHaveClass('mtx-text-field--has-value');
  });

  it('valor inicial, fecha y placeholder visible activan --has-value', () => {
    const { container } = render(
      <>
        <TextField label="A" defaultValue="Initial" />
        <TextField label="B" type="date" />
        <TextField label="C" placeholder="Visible" staticLabel />
      </>,
    );
    container.querySelectorAll('.mtx-text-field').forEach((root) => expect(root).toHaveClass('mtx-text-field--has-value'));
  });

  it('controlado: refleja el valor del padre', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState('abc');
      return (
        <>
          <TextField label="C" value={value} onChange={(_, next) => setValue(next.toUpperCase())} />
          <button type="button" onClick={() => setValue('')}>
            reset
          </button>
        </>
      );
    }
    const { container } = render(<Controlled />);
    const input = screen.getByLabelText('C') as HTMLInputElement;
    expect(input.value).toBe('abc');
    await user.type(input, 'd');
    expect(input.value).toBe('ABCD');
    await user.click(screen.getByText('reset'));
    expect(input.value).toBe('');
    expect(rootOf(container)).not.toHaveClass('mtx-text-field--has-value');
  });

  it('el reset del formulario restaura el valor no controlado', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form>
        <TextField label="R" />
        <button type="reset">reset</button>
      </form>,
    );
    const input = screen.getByLabelText('R') as HTMLInputElement;
    await user.type(input, 'xyz');
    expect(rootOf(container)).toHaveClass('mtx-text-field--has-value');
    await user.click(screen.getByText('reset'));
    await new Promise((resolve) => setTimeout(resolve, 5));
    expect(input.value).toBe('');
    expect(rootOf(container)).not.toHaveClass('mtx-text-field--has-value');
  });

  it('error + helperText: clases, aria-invalid y aria-describedby', () => {
    const { container, rerender } = render(<TextField id="tf" label="Email" helperText="Use your email" aria-describedby="ext" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-describedby', 'ext tf-helper-text');
    expect(input).not.toHaveAttribute('aria-invalid');
    const support = container.querySelector('#tf-helper-text')!;
    expect(support).toHaveClass('mtx-text-field__supporting-text');
    expect(support.querySelector('.mtx-text-field__helper-text')).toHaveTextContent('Use your email');
    rerender(<TextField id="tf" label="Email" helperText="Invalid email" error />);
    expect(rootOf(container)).toHaveClass('mtx-text-field--error');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'tf-helper-text');
    rerender(<TextField id="tf" label="Email" />);
    expect(input).not.toHaveAttribute('aria-describedby');
    expect(container.querySelector('.mtx-text-field__supporting-text')).toBeNull();
  });

  it('hereda error, disabled y required de FormControl', () => {
    const { container } = render(
      <FormControl error disabled required>
        <TextField label="Inherited" startAction="search" startActionLabel="Search" />
      </FormControl>,
    );
    const input = screen.getByLabelText('Inherited');
    expect(input).toBeDisabled();
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(rootOf(container)).toHaveClass('mtx-text-field--error');
    expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled();
  });

  it('con helperText propio no enlaza los helpers del FormControl', () => {
    render(
      <FormControl>
        <TextField id="a" label="A" helperText="Help A" />
        <TextField id="b" label="B" />
        <FormHelperText id="group-help">Group help</FormHelperText>
      </FormControl>,
    );
    expect(screen.getByLabelText('A')).toHaveAttribute('aria-describedby', 'a-helper-text');
    expect(screen.getByLabelText('B')).toHaveAttribute('aria-describedby', 'group-help');
  });

  it('disabled y readOnly llegan al input', () => {
    render(
      <>
        <TextField label="D" disabled defaultValue="x" />
        <TextField label="R" readOnly defaultValue="y" />
      </>,
    );
    expect(screen.getByLabelText('D')).toBeDisabled();
    expect(screen.getByLabelText('R')).toHaveAttribute('readonly');
  });

  it('toggle de contraseña: tipo, aria-pressed, icono y callback', async () => {
    const user = userEvent.setup();
    const onVisibility = vi.fn();
    const { container } = render(<TextField id="pw" label="Password" type="password" passwordToggle onPasswordVisibilityChange={onVisibility} />);
    const input = container.querySelector('input')!;
    const button = screen.getByRole('button', { name: 'Show password' });
    expect(button).toHaveClass('mtx-icon-button', 'mtx-text-field__action', 'mtx-text-field__action--end');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveAttribute('aria-controls', 'pw');
    expect(button).toHaveTextContent('visibility');
    expect(rootOf(container)).toHaveClass('mtx-text-field--adorned-end');
    await user.click(button);
    expect(input).toHaveAttribute('type', 'text');
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveTextContent('visibility_off');
    expect(onVisibility).toHaveBeenLastCalledWith(true);
    await user.click(button);
    expect(input).toHaveAttribute('type', 'password');
    expect(onVisibility).toHaveBeenLastCalledWith(false);
  });

  it('toggle de contraseña: prioridad sobre endIcon, small, traducción y label propio', () => {
    const { container } = render(
      <>
        <TextField label="P" type="password" passwordToggle endIcon="key" size="small" />
        <I18nProvider locale="es">
          <TextField label="Clave" type="password" passwordToggle />
        </I18nProvider>
        <TextField label="Q" type="password" passwordToggle passwordToggleLabel="Show passwords" />
        <TextField label="T" passwordToggle />
      </>,
    );
    const roots = container.querySelectorAll('.mtx-text-field');
    expect(roots[0].querySelectorAll('.mtx-text-field__adornment--end')).toHaveLength(1);
    expect(roots[0].querySelector('button')).toHaveClass('mtx-icon-button--small');
    expect(roots[1].querySelector('button')).toHaveAttribute('aria-label', 'Mostrar contraseña');
    expect(roots[2].querySelector('button')).toHaveAttribute('aria-label', 'Show passwords');
    expect(roots[3].querySelector('button')).toBeNull();
  });

  it('acciones inicial y final llaman a onAdornmentClick sin robar el foco', async () => {
    const user = userEvent.setup();
    const onAdornmentClick = vi.fn();
    const { container } = render(
      <TextField label="Search" startAction="search" startActionLabel="Run search" endAction="clear" endActionLabel="Clear" onAdornmentClick={onAdornmentClick} />,
    );
    const input = container.querySelector('input')!;
    expect(rootOf(container)).toHaveClass('mtx-text-field--adorned-start', 'mtx-text-field--adorned-end');
    const clear = screen.getByRole('button', { name: 'Clear' });
    expect(fireEvent.mouseDown(clear)).toBe(false);
    await user.click(clear);
    expect(onAdornmentClick).toHaveBeenCalledTimes(1);
    const detail = onAdornmentClick.mock.calls[0][0];
    expect(detail.position).toBe('end');
    expect(detail.button).toBe(clear);
    expect(detail.input).toBe(input);
    await user.click(screen.getByRole('button', { name: 'Run search' }));
    expect(onAdornmentClick.mock.calls[1][0].position).toBe('start');
  });

  it('startAdornment y endAdornment libres e iconos como nodo', () => {
    const { container } = render(
      <TextField label="Weight" startAdornment="$" endAdornment="kg" />,
    );
    // Adorno de texto: sin `--start`/`--adorned-start` (el CSS de icono desplazaría el label 32px).
    const prefix = container.querySelector('.mtx-text-field__container')!.firstElementChild!;
    expect(prefix).toHaveClass('mtx-text-field__adornment');
    expect(prefix).not.toHaveClass('mtx-text-field__adornment--start');
    expect(prefix).toHaveTextContent('$');
    expect(rootOf(container)).not.toHaveClass('mtx-text-field--adorned-start');
    expect(container.querySelector('input')!.style.paddingInlineStart).toBe('0px');
    expect(container.querySelector('.mtx-text-field__adornment--end')).toHaveTextContent('kg');
    // Adorno inicial libre: el label queda flotando (shrink de MUI).
    expect(rootOf(container)).toHaveClass('mtx-text-field--has-value');
    const { container: c2 } = render(<TextField label="I" startIcon={<svg data-testid="svg" />} />);
    expect(c2.querySelector('.mtx-text-field__adornment--start')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByTestId('svg')).toBeInTheDocument();
  });

  it('contador de caracteres con límite activa el error al excederlo', async () => {
    const user = userEvent.setup();
    const { container } = render(<TextField label="Title" counter="characters" maxChars={10} />);
    const counter = container.querySelector('.mtx-text-field__counter')!;
    expect(counter).toHaveTextContent('0 / 10');
    expect(counter).toHaveAttribute('aria-live', 'polite');
    const input = screen.getByLabelText('Title');
    await user.type(input, 'Hola');
    expect(counter).toHaveTextContent('4 / 10');
    await user.type(input, ' mundo largo');
    expect(counter).toHaveClass('mtx-text-field__counter--error');
    expect(rootOf(container)).toHaveClass('mtx-text-field--error');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    await user.clear(input);
    expect(rootOf(container)).not.toHaveClass('mtx-text-field--error');
  });

  it('contador de palabras, maxLength y textos traducidos', () => {
    const { container } = render(
      <>
        <TextField label="W" multiline maxWords={3} defaultValue="one two three four five" />
        <TextField label="L" maxLength={20} defaultValue="secret" />
        <TextField label="X" multiline counter="words" defaultValue="one two three" />
        <I18nProvider locale="es">
          <TextField label="B" multiline counter="both" maxWords={10} maxChars={100} defaultValue="uno dos" />
        </I18nProvider>
      </>,
    );
    const counters = container.querySelectorAll('.mtx-text-field__counter');
    expect(counters[0]).toHaveTextContent('5 / 3');
    expect(counters[0]).toHaveClass('mtx-text-field__counter--error');
    expect(counters[1]).toHaveTextContent('6 / 20');
    expect(counters[2]).toHaveTextContent('3 words');
    expect(counters[3]).toHaveTextContent('2/10 pal. | 7/100 car.');
  });

  it('multiline: textarea con rows por defecto 3 y auto-resize condicional', () => {
    const { container } = render(
      <>
        <TextField label="A" multiline />
        <TextField label="B" multiline autoResize rows={2} />
      </>,
    );
    const [a, b] = Array.from(container.querySelectorAll('.mtx-text-field'));
    expect(a).toHaveClass('mtx-text-field--multiline');
    expect(a).not.toHaveClass('mtx-text-field--auto-resize');
    expect(a.querySelector('textarea')).toHaveAttribute('rows', '3');
    expect(b).toHaveClass('mtx-text-field--auto-resize');
    expect(b.querySelector('textarea')).toHaveAttribute('rows', '2');
  });

  it('auto-resize ajusta la altura y respeta maxRows', () => {
    const scroll = vi.spyOn(HTMLTextAreaElement.prototype, 'scrollHeight', 'get').mockReturnValue(120);
    const { container } = render(
      <>
        <TextField label="A" multiline autoResize />
        <TextField label="B" multiline maxRows={2} />
      </>,
    );
    const [a, b] = Array.from(container.querySelectorAll('textarea'));
    expect(a.style.height).toBe('120px');
    expect(a.style.overflowY).toBe('hidden');
    expect(b.style.overflowY).toBe('auto');
    expect(parseInt(b.style.height, 10)).toBeLessThanOrEqual(100);
    scroll.mockRestore();
  });

  it('máscara de patrón con valor limpio y conservación del cursor', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TextField label="Phone" mask="(000) 000-0000" onChange={onChange} />);
    const input = screen.getByLabelText('Phone') as HTMLInputElement;
    await user.type(input, '3001234567');
    expect(input.value).toBe('(300) 123-4567');
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), '(300) 123-4567', { unmaskedValue: '3001234567', isMaskComplete: true });
    expect(input.selectionStart).toBe(input.value.length);
  });

  it('máscara: Retroceso sobre un literal borra también el dígito anterior', async () => {
    const user = userEvent.setup();
    render(<TextField label="Tel" mask="phone" />);
    const input = screen.getByLabelText('Tel') as HTMLInputElement;
    await user.type(input, '123');
    expect(input.value).toBe('(123) ');
    await user.keyboard('{Backspace}');
    expect(input.value).toBe('(12');
  });

  it('atajos de máscara y currency (controlado con valor sin formato)', () => {
    function Money() {
      const [value, setValue] = useState('125000');
      return <TextField label="Price" mask="currency" value={value} onChange={(_, next) => setValue(next)} />;
    }
    render(
      <>
        <TextField label="Card" mask="credit-card" defaultValue="1234567890123456" />
        <TextField label="Amount" mask="currency" currencyOptions={{ prefix: '', suffix: ' €', thousands: '.', decimal: ',' }} defaultValue="125000" />
        <Money />
      </>,
    );
    expect((screen.getByLabelText('Card') as HTMLInputElement).value).toBe('1234 5678 9012 3456');
    expect((screen.getByLabelText('Amount') as HTMLInputElement).value).toBe('1.250,00 €');
    expect((screen.getByLabelText('Price') as HTMLInputElement).value).toBe('$ 1,250.00');
  });

  it('currency: al escribir rellena desde los decimales', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TextField label="Money" mask="currency" onChange={onChange} />);
    const input = screen.getByLabelText('Money') as HTMLInputElement;
    await user.type(input, '125000');
    expect(input.value).toBe('$ 1,250.00');
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), '$ 1,250.00', { unmaskedValue: '1250.00', isMaskComplete: true });
  });

  it('select nativo: chevron único y --has-value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(
      <TextField select label="Country" defaultValue="cl" onChange={onChange}>
        <option value="es">Spain</option>
        <option value="cl">Chile</option>
      </TextField>,
    );
    const root = rootOf(container);
    expect(root).toHaveClass('mtx-text-field--select', 'mtx-text-field--has-value');
    expect(root.querySelectorAll('.mtx-text-field__chevron')).toHaveLength(1);
    const select = screen.getByLabelText('Country') as HTMLSelectElement;
    expect(select.value).toBe('cl');
    await user.selectOptions(select, 'es');
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), 'es', expect.anything());
  });

  it('encadena onFocus/onBlur de inputProps y de las props directas', () => {
    const calls: string[] = [];
    render(
      <TextField
        label="F"
        inputProps={{ onFocus: () => calls.push('inputProps focus'), onBlur: () => calls.push('inputProps blur') }}
        onFocus={() => calls.push('focus')}
        onBlur={() => calls.push('blur')}
      />,
    );
    const input = screen.getByLabelText('F');
    fireEvent.focus(input);
    fireEvent.blur(input);
    expect(calls).toEqual(['inputProps focus', 'focus', 'inputProps blur', 'blur']);
  });

  it('ref a la raíz, inputRef, inputProps y props nativas', () => {
    const ref = createRef<HTMLDivElement>();
    const inputRef = createRef<HTMLInputElement>();
    const onFocus = vi.fn();
    render(
      <TextField
        ref={ref}
        inputRef={inputRef}
        label="N"
        name="n"
        autoComplete="name"
        required
        data-testid="root"
        style={{ maxWidth: 200 }}
        inputProps={{ 'data-x': '1', pattern: '[a-z]+' }}
        onFocus={onFocus}
      />,
    );
    expect(ref.current).toBe(screen.getByTestId('root'));
    expect(ref.current).toHaveStyle({ maxWidth: '200px' });
    expect(inputRef.current).toBe(screen.getByLabelText('N'));
    expect(inputRef.current).toHaveAttribute('name', 'n');
    expect(inputRef.current).toHaveAttribute('autocomplete', 'name');
    expect(inputRef.current).toHaveAttribute('data-x', '1');
    expect(inputRef.current).toHaveAttribute('pattern', '[a-z]+');
    expect(inputRef.current).toBeRequired();
    inputRef.current!.focus();
    expect(onFocus).toHaveBeenCalled();
  });
});
