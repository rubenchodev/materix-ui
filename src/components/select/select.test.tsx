import { createRef, useState } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectParity, mountVanilla } from '../../../tests/parity';
import { I18nProvider } from '../../i18n';
import { FormControl } from '../form-helper-text';
import { Select } from './index';

const CITIES = [
  { value: 'mdx', label: 'Ciudad de México' },
  { value: 'gdl', label: 'Guadalajara' },
  { value: 'mty', label: 'Monterrey' },
];
const ABC = [
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B' },
  { value: 'c', label: 'C' },
];

const getControl = () => screen.getByRole('combobox') as HTMLDivElement;
const getMenu = () => document.querySelector('.mtx-select__menu') as HTMLDivElement;
const optionByValue = (value: string) => document.querySelector(`.mtx-select__menu [data-value="${value}"]`) as HTMLElement;

describe('Select', () => {
  it('paridad DOM con vanilla: single-element con label, variante y tamaño', async () => {
    const vanilla = await mountVanilla(
      '<select class="extra" data-mtx="select" data-label="Ciudad" data-variant="outlined" data-size="small" name="city">'
        + '<option value="mdx">Ciudad de México</option><option value="gdl">Guadalajara</option></select>',
    );
    const { container } = render(
      <Select className="extra" label="Ciudad" size="small" name="city">
        <option value="mdx">Ciudad de México</option>
        <option value="gdl">Guadalajara</option>
      </Select>,
    );
    expectParity(container.firstElementChild, vanilla.firstElementChild, { ignoreSelectors: ['.mtx-select__menu'] });
  });

  it('paridad DOM con vanilla: filled con icono inicial, color, error y helper', async () => {
    const vanilla = await mountVanilla(
      '<select data-mtx="select" data-label="País" data-variant="filled" data-start-icon="public" data-color="secondary"'
        + ' data-error data-helper-text="Obligatorio" required>'
        + '<option value="co" data-icon="flag">Colombia</option><option value="mx">México</option></select>',
    );
    const { container } = render(
      <Select label="País" variant="filled" startIcon="public" color="secondary" error helperText="Obligatorio" required
        options={[{ value: 'co', label: 'Colombia', icon: 'flag' }, { value: 'mx', label: 'México' }]} />,
    );
    expectParity(container.firstElementChild, vanilla.firstElementChild, { ignoreSelectors: ['.mtx-select__menu'] });
  });

  it('paridad DOM con vanilla: múltiple con formato count y placeholder', async () => {
    const vanilla = await mountVanilla(
      '<select data-mtx="select" data-label="Langs" data-variant="standard" data-selected-text-format="count" multiple>'
        + '<option value="a" selected>A</option><option value="b" selected>B</option><option value="c">C</option></select>',
    );
    const { container } = render(
      <Select label="Langs" variant="standard" selectedTextFormat="count" multiple defaultValue={['a', 'b']} options={ABC} />,
    );
    expectParity(container.firstElementChild, vanilla.firstElementChild, { ignoreSelectors: ['.mtx-select__menu'] });
  });

  it('marcado: combobox accesible, select nativo oculto y muesca outlined', () => {
    const { container } = render(<Select label="Ciudad" options={CITIES} name="city" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass('mtx-select', 'mtx-select--outlined', 'mtx-select--color-primary');
    const control = screen.getByRole('combobox', { name: 'Ciudad' });
    expect(control).toHaveAttribute('aria-haspopup', 'listbox');
    expect(control).toHaveAttribute('aria-expanded', 'false');
    expect(control).toHaveAttribute('tabindex', '0');
    const native = root.querySelector('select') as HTMLSelectElement;
    expect(native).toHaveClass('mtx-select__native');
    expect(native).toHaveAttribute('aria-hidden', 'true');
    expect(native.name).toBe('city');
    expect(native.value).toBe('mdx');
    expect(root.querySelector('fieldset.mtx-select__outline legend span')).toHaveTextContent('Ciudad');
    expect(root.querySelector('.mtx-select__display-text')).toHaveTextContent('Ciudad de México');
  });

  it('abre con clic, porta el menú y cierra al elegir en modo único', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(<Select label="Ciudad" options={CITIES} onChange={onChange} />);
    await user.click(getControl());
    expect(getControl()).toHaveAttribute('aria-expanded', 'true');
    expect(container.firstElementChild).toHaveClass('mtx-select--open');
    const menu = getMenu();
    expect(menu.parentElement).toBe(document.body);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await user.click(optionByValue('gdl'));
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), 'gdl');
    expect(getControl()).toHaveAttribute('aria-expanded', 'false');
    expect(getControl()).toHaveFocus();
    expect(container.querySelector('select')!.value).toBe('gdl');
    await waitFor(() => expect(getMenu()).toBeNull());
  });

  it('múltiple: alterna opciones, mantiene el menú abierto y muestra valores', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select label="Letras" multiple options={ABC} defaultValue={['a']} onChange={onChange} />);
    expect(document.querySelector('.mtx-select__display-text')).toHaveTextContent('A');
    await user.click(getControl());
    expect(screen.getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true');
    await user.click(optionByValue('c'));
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), ['a', 'c']);
    expect(getControl()).toHaveAttribute('aria-expanded', 'true');
    expect(optionByValue('c')).toHaveAttribute('aria-selected', 'true');
    expect(optionByValue('c').querySelector('.mtx-select__check')).not.toBeNull();
    expect(document.querySelector('.mtx-select__display-text')).toHaveTextContent('A, C');
    const native = document.querySelector('select') as HTMLSelectElement;
    expect(Array.from(native.selectedOptions, (o) => o.value)).toEqual(['a', 'c']);
  });

  it('formatos count, count > N y static', () => {
    const { rerender } = render(<Select multiple options={ABC} value={['a']} selectedTextFormat="count" />);
    expect(document.querySelector('.mtx-select__display-text')).toHaveTextContent('1 selected');
    rerender(<Select multiple options={ABC} value={['a', 'b']} selectedTextFormat="count > 2" />);
    expect(document.querySelector('.mtx-select__display-text')).toHaveTextContent('A, B');
    rerender(<Select multiple options={ABC} value={['a', 'b', 'c']} selectedTextFormat="count > 2" />);
    expect(document.querySelector('.mtx-select__display-text')).toHaveTextContent('3 selected');
    rerender(<Select multiple options={ABC} value={['a']} selectedTextFormat="static" placeholder="Columnas" />);
    expect(document.querySelector('.mtx-select__display-text')).toHaveTextContent('Columnas');
  });

  it('textos i18n en español', async () => {
    const user = userEvent.setup();
    render(
      <I18nProvider locale="es">
        <Select multiple search actionsBox options={ABC} value={['a', 'b']} selectedTextFormat="count" />
      </I18nProvider>,
    );
    expect(document.querySelector('.mtx-select__display-text')).toHaveTextContent('2 seleccionados');
    await user.click(getControl());
    expect(screen.getByRole('button', { name: 'Seleccionar todo' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Deseleccionar todo' })).toBeInTheDocument();
  });

  it('actions box: seleccionar todo respeta deshabilitadas y maxOptions; deseleccionar limpia', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Select multiple actionsBox maxOptions={2} onChange={onChange}
        options={[{ value: 'x', label: 'X', disabled: true }, ...ABC]} />,
    );
    await user.click(getControl());
    await user.click(screen.getByRole('button', { name: 'Select all' }));
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), ['a', 'b']);
    expect(optionByValue('c')).toHaveClass('mtx-select__option--disabled');
    await user.click(screen.getByRole('button', { name: 'Deselect all' }));
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), []);
  });

  it('maxOptions bloquea opciones no seleccionadas al llegar al límite', async () => {
    const user = userEvent.setup();
    render(<Select multiple maxOptions={2} options={ABC} defaultValue={['a']} />);
    await user.click(getControl());
    await user.click(optionByValue('b'));
    expect(optionByValue('c')).toHaveAttribute('aria-disabled', 'true');
    await user.click(optionByValue('c'));
    expect(optionByValue('c')).toHaveAttribute('aria-selected', 'false');
  });

  it('grupos desde children <optgroup> con opciones deshabilitadas', async () => {
    const user = userEvent.setup();
    render(
      <Select label="Stack" multiple>
        <optgroup label="Frontend">
          <option value="react">React</option>
          <option value="angular" disabled>Angular</option>
        </optgroup>
        <optgroup label="Backend" disabled>
          <option value="node">Node.js</option>
        </optgroup>
      </Select>,
    );
    expect(document.querySelectorAll('select optgroup')).toHaveLength(2);
    await user.click(getControl());
    const groups = screen.getAllByRole('group');
    expect(groups).toHaveLength(2);
    expect(groups[0]).toHaveAccessibleName('Frontend');
    expect(optionByValue('angular')).toHaveAttribute('aria-disabled', 'true');
    expect(optionByValue('node')).toHaveAttribute('aria-disabled', 'true');
  });

  it('búsqueda con debounce, sin resultados parametrizable y foco en la caja', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      render(<Select label="Ciudad" search options={CITIES} noResultsText={'Sin coincidencias para "{0}"'} />);
      fireEvent.click(getControl());
      await act(async () => {
        vi.advanceTimersByTime(20);
      });
      const input = document.querySelector('.mtx-select__search') as HTMLInputElement;
      expect(input).toHaveFocus();
      fireEvent.change(input, { target: { value: 'guad' } });
      expect(optionByValue('mdx')).not.toBeNull();
      await act(async () => {
        vi.advanceTimersByTime(200);
      });
      expect(optionByValue('mdx')).toBeNull();
      expect(optionByValue('gdl')).not.toBeNull();
      fireEvent.change(input, { target: { value: 'zz' } });
      await act(async () => {
        vi.advanceTimersByTime(200);
      });
      expect(document.querySelector('.mtx-select__no-results')).toHaveTextContent('Sin coincidencias para "zz"');
      // La búsqueda ignora tildes y busca también por valor.
      fireEvent.change(input, { target: { value: 'mexico' } });
      await act(async () => {
        vi.advanceTimersByTime(200);
      });
      expect(optionByValue('mdx')).not.toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it('cancela el debounce de búsqueda al desmontar', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const clear = vi.spyOn(globalThis, 'clearTimeout');
    try {
      const { unmount } = render(<Select search options={CITIES} aria-label="Ciudad" />);
      fireEvent.click(getControl());
      fireEvent.change(document.querySelector('.mtx-select__search')!, { target: { value: 'gu' } });
      const calls = clear.mock.calls.length;
      unmount();
      expect(clear.mock.calls.length).toBeGreaterThan(calls);
      expect(() => vi.advanceTimersByTime(300)).not.toThrow();
    } finally {
      clear.mockRestore();
      vi.useRealTimers();
    }
  });

  it('teclado: flechas, Home/End, typeahead, Enter y aria-activedescendant', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select label="Ciudad" options={CITIES} onChange={onChange} />);
    const control = getControl();
    control.focus();
    await user.keyboard('{ArrowDown}');
    expect(control).toHaveAttribute('aria-expanded', 'true');
    const activeId = () => control.getAttribute('aria-activedescendant');
    expect(document.getElementById(activeId()!)).toHaveAttribute('data-value', 'mdx');
    await user.keyboard('{ArrowDown}');
    expect(document.getElementById(activeId()!)).toHaveAttribute('data-value', 'gdl');
    await user.keyboard('{End}');
    expect(document.getElementById(activeId()!)).toHaveAttribute('data-value', 'mty');
    await user.keyboard('{Home}');
    expect(document.getElementById(activeId()!)).toHaveAttribute('data-value', 'mdx');
    await user.keyboard('{ArrowUp}');
    expect(document.getElementById(activeId()!)).toHaveAttribute('data-value', 'mty');
    await user.keyboard('g');
    expect(document.getElementById(activeId()!)).toHaveAttribute('data-value', 'gdl');
    expect(document.getElementById(activeId()!)).toHaveClass('mtx-select__option--focused');
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), 'gdl');
    expect(control).toHaveAttribute('aria-expanded', 'false');
    expect(control).toHaveFocus();
  });

  it('Escape cierra y devuelve el foco; Tab cierra; clic fuera cierra', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <>
        <Select label="Ciudad" options={CITIES} onClose={onClose} />
        <button type="button">fuera</button>
      </>,
    );
    const control = getControl();
    await user.click(control);
    await user.keyboard('{Escape}');
    expect(control).toHaveAttribute('aria-expanded', 'false');
    expect(control).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(control).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard('{Tab}');
    expect(control).toHaveAttribute('aria-expanded', 'false');
    await user.click(control);
    await user.click(screen.getByRole('button', { name: 'fuera' }));
    expect(control).toHaveAttribute('aria-expanded', 'false');
    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it('placeholder en modo único: sin selección hasta elegir y select nativo vacío', () => {
    const { rerender } = render(
      <Select label="Rol" placeholder="Elige un rol" value="" onChange={() => undefined}
        options={[{ value: 'admin', label: 'Admin' }, { value: 'editor', label: 'Editor' }]} />,
    );
    const display = document.querySelector('.mtx-select__display')!;
    expect(display).toHaveTextContent('Elige un rol');
    expect(display).toHaveClass('mtx-select__display--empty');
    expect((document.querySelector('select') as HTMLSelectElement).selectedIndex).toBe(-1);
    rerender(
      <Select label="Rol" placeholder="Elige un rol" value="editor" onChange={() => undefined}
        options={[{ value: 'admin', label: 'Admin' }, { value: 'editor', label: 'Editor' }]} />,
    );
    expect(display).toHaveTextContent('Editor');
    expect(display).not.toHaveClass('mtx-select__display--empty');
  });

  it('iconos e imágenes en opciones y en el display', async () => {
    const user = userEvent.setup();
    render(
      <Select aria-label="País" defaultValue="co" options={[
        { value: 'co', label: 'Colombia', image: 'https://flagcdn.com/w40/co.png' },
        { value: 'mail', label: 'Correo', icon: 'email', secondary: 'Respuesta en 24 h' },
      ]} />,
    );
    expect(document.querySelector('img.mtx-select__display-image')).toHaveAttribute('src', 'https://flagcdn.com/w40/co.png');
    await user.click(getControl());
    expect(optionByValue('mail').querySelector('.mtx-select__option-icon.material-icons')).toHaveTextContent('email');
    expect(optionByValue('mail').querySelector('.mtx-select__option-secondary')).toHaveTextContent('Respuesta en 24 h');
    await user.click(optionByValue('mail'));
    expect(document.querySelector('.mtx-select__display-icon')).toHaveTextContent('email');
  });

  it('children <option> con data-icon y data-image', () => {
    render(
      <Select aria-label="Contacto">
        <option value="email" data-icon="email">Correo</option>
        <option value="mx" data-image="/flags/mx.svg">México</option>
      </Select>,
    );
    expect(document.querySelector('.mtx-select__display-icon')).toHaveTextContent('email');
  });

  it('renderValue permite pintar chips', () => {
    render(
      <Select multiple options={ABC} value={['a', 'b']}
        renderValue={(selected) => selected.map((o) => <span key={o.value} className="chip">{o.label}</span>)} />,
    );
    expect(document.querySelectorAll('.mtx-select__display .chip')).toHaveLength(2);
  });

  it('disabled y readOnly no abren el menú', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Select label="Plan" disabled options={ABC} />);
    expect(getControl()).toHaveAttribute('aria-disabled', 'true');
    expect(getControl()).toHaveAttribute('tabindex', '-1');
    expect(document.querySelector('select')).toBeDisabled();
    rerender(<Select label="Plan" readOnly options={ABC} />);
    expect(getControl()).toHaveAttribute('aria-readonly', 'true');
    await user.click(getControl());
    expect(getControl()).toHaveAttribute('aria-expanded', 'false');
  });

  it('error, helperText y FormControl', () => {
    render(
      <FormControl error required>
        <Select label="Moneda" helperText="Elige una moneda" options={ABC} />
      </FormControl>,
    );
    const control = getControl();
    expect(control).toHaveAttribute('aria-invalid', 'true');
    expect(control).toHaveAttribute('aria-required', 'true');
    expect(control.closest('.mtx-select')).toHaveClass('mtx-select--error');
    const helper = document.querySelector('.mtx-select__helper-text')!;
    expect(helper).toHaveTextContent('Elige una moneda');
    expect(control.getAttribute('aria-describedby')).toContain(helper.id);
    expect(document.querySelector('select')).toBeRequired();
  });

  it('open controlado con onOpen/onClose', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Select label="Ciudad" options={CITIES} open={open} onOpen={() => setOpen(true)} onClose={() => setOpen(false)} />
          <span data-testid="state">{String(open)}</span>
        </>
      );
    }
    render(<Controlled />);
    await user.click(getControl());
    expect(screen.getByTestId('state')).toHaveTextContent('true');
    await user.click(optionByValue('mty'));
    expect(screen.getByTestId('state')).toHaveTextContent('false');
  });

  it('value controlado y envío de formulario con name', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState<string | string[]>(['a']);
      return (
        <form data-testid="form">
          <Select name="letters" multiple options={ABC} value={value} onChange={(_, next) => setValue(next)} aria-label="Letras" />
        </form>
      );
    }
    render(<Controlled />);
    await user.click(getControl());
    await user.click(optionByValue('b'));
    const data = new FormData(screen.getByTestId('form') as HTMLFormElement);
    expect(data.getAll('letters')).toEqual(['a', 'b']);
  });

  it('reset del formulario restaura el valor inicial (no controlado)', async () => {
    const user = userEvent.setup();
    render(
      <form data-testid="form">
        <Select name="city" options={CITIES} defaultValue="gdl" aria-label="Ciudad" />
      </form>,
    );
    await user.click(getControl());
    await user.click(optionByValue('mty'));
    expect(document.querySelector('.mtx-select__display-text')).toHaveTextContent('Monterrey');
    act(() => (screen.getByTestId('form') as HTMLFormElement).reset());
    expect(document.querySelector('.mtx-select__display-text')).toHaveTextContent('Guadalajara');
  });

  it('reset con placeholder: el nativo queda vacío y required lo bloquea', async () => {
    const user = userEvent.setup();
    render(
      <form data-testid="form">
        <Select name="c" required placeholder="Elige" options={ABC} aria-label="Letra" />
      </form>,
    );
    const form = screen.getByTestId('form') as HTMLFormElement;
    await user.click(getControl());
    await user.click(optionByValue('b'));
    expect(new FormData(form).get('c')).toBe('b');
    act(() => form.reset());
    await waitFor(() => expect((document.querySelector('select') as HTMLSelectElement).selectedIndex).toBe(-1));
    expect(new FormData(form).get('c')).toBeNull();
    expect(form.checkValidity()).toBe(false);
    expect(document.querySelector('.mtx-select__display')).toHaveTextContent('Elige');
  });

  it('reset con defaultValue: el nativo y la UI vuelven al valor inicial', async () => {
    const user = userEvent.setup();
    render(
      <form data-testid="form">
        <Select name="c" defaultValue="b" options={ABC} aria-label="Letra" />
      </form>,
    );
    const form = screen.getByTestId('form') as HTMLFormElement;
    await user.click(getControl());
    await user.click(optionByValue('c'));
    act(() => form.reset());
    await waitFor(() => expect(new FormData(form).get('c')).toBe('b'));
    expect(document.querySelector('.mtx-select__display-text')).toHaveTextContent('B');
  });

  it('Tab desde la búsqueda cierra y devuelve el foco al combobox', async () => {
    const user = userEvent.setup();
    render(<Select search options={CITIES} aria-label="Ciudad" />);
    await user.click(getControl());
    const input = document.querySelector('.mtx-select__search') as HTMLInputElement;
    await waitFor(() => expect(input).toHaveFocus());
    fireEvent.keyDown(input, { key: 'Tab' });
    expect(getControl()).toHaveAttribute('aria-expanded', 'false');
    expect(getControl()).toHaveFocus();
  });

  it('cerrar con open controlado devuelve el foco si estaba en el menú', async () => {
    const { rerender } = render(<Select search open options={CITIES} aria-label="Ciudad" />);
    const input = document.querySelector('.mtx-select__search') as HTMLInputElement;
    await waitFor(() => expect(input).toHaveFocus());
    rerender(<Select search open={false} options={CITIES} aria-label="Ciudad" />);
    expect(getControl()).toHaveFocus();
  });

  it('cierra el menú si el control sale del viewport', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Select options={CITIES} aria-label="Ciudad" onClose={onClose} />);
    await user.click(getControl());
    getControl().getBoundingClientRect = () =>
      ({ left: 0, top: -200, right: 200, bottom: -144, width: 200, height: 56, x: 0, y: -200, toJSON: () => ({}) }) as DOMRect;
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    expect(getControl()).toHaveAttribute('aria-expanded', 'false');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('refs: raíz, control e input nativo', () => {
    const ref = createRef<HTMLDivElement>();
    const controlRef = createRef<HTMLDivElement>();
    const inputRef = createRef<HTMLSelectElement>();
    render(<Select ref={ref} controlRef={controlRef} inputRef={inputRef} options={ABC} aria-label="X" />);
    expect(ref.current).toHaveClass('mtx-select');
    expect(controlRef.current).toHaveClass('mtx-select__control');
    expect(inputRef.current).toHaveClass('mtx-select__native');
  });

  it('el menú hereda el color y se posiciona fijo con ancho del control', async () => {
    const user = userEvent.setup();
    render(<Select label="Ciudad" color="success" options={CITIES} />);
    getControl().getBoundingClientRect = () =>
      ({ left: 20, top: 20, right: 220, bottom: 76, width: 200, height: 56, x: 20, y: 20, toJSON: () => ({}) }) as DOMRect;
    await user.click(getControl());
    const menu = getMenu();
    expect(menu).toHaveClass('mtx-select__menu--color-success');
    await waitFor(() => expect(menu.style.position).toBe('fixed'));
    expect(menu.style.top).toBe('80px');
    expect(menu.style.minWidth).toBe('200px');
  });
});
