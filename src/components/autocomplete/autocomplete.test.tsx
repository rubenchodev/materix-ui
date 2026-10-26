import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { expectParity, mountVanilla } from '../../../tests/parity';
import { I18nProvider } from '../../i18n';
import { FormControl, FormHelperText } from '../form-helper-text';
import { Autocomplete } from './Autocomplete';

const COUNTRIES = [
  { value: 'co', label: 'Colombia' },
  { value: 'mx', label: 'México' },
  { value: 'pe', label: 'Peru' },
  { value: 'cl', label: 'Chile', disabled: true },
  { value: 'ar', label: 'Argentina' },
];

const getInput = () => screen.getByRole('combobox') as HTMLInputElement;
const listbox = () => document.querySelector('.mtx-autocomplete__listbox') as HTMLElement | null;
const optionEls = () => Array.from(document.querySelectorAll<HTMLElement>('.mtx-autocomplete__option'));
const popper = () => document.querySelector('.mtx-autocomplete__popper') as HTMLElement | null;
const key = (key: string) => fireEvent.keyDown(getInput(), { key });

/** Escribe en el input como el usuario. */
function type(text: string) {
  const input = getInput();
  act(() => input.focus());
  fireEvent.change(input, { target: { value: text } });
}

describe('Autocomplete — paridad con vanilla', () => {
  it('selección única con valor, label y name', async () => {
    const vanilla = await mountVanilla(
      `<input data-mtx="autocomplete" data-label="Country" data-options='["Colombia","Peru"]' name="country" data-value="Peru" />`,
    );
    const { container } = render(<Autocomplete label="Country" options={['Colombia', 'Peru']} name="country" defaultValue="Peru" />);
    expectParity(container.firstElementChild, vanilla.firstElementChild);
  });

  it('múltiple small filled con icono, chips, carga y helper', async () => {
    const vanilla = await mountVanilla(
      `<input data-mtx="autocomplete" data-label="Skills" data-start-icon="search" data-multiple data-size="small" data-options='["A","B","C"]' data-value="A,B" data-loading name="s" data-helper-text="Help" data-variant="filled" />`,
    );
    const { container } = render(
      <Autocomplete
        label="Skills"
        startIcon="search"
        multiple
        size="small"
        options={['A', 'B', 'C']}
        defaultValue={['A', 'B']}
        loading
        name="s"
        helperText="Help"
        variant="filled"
      />,
    );
    expectParity(container.firstElementChild, vanilla.firstElementChild);
  });

  it('estados: deshabilitado, solo lectura, requerido, error y limitTags', async () => {
    const vanilla = await mountVanilla(
      `<input data-mtx="autocomplete" data-label="A" data-multiple data-limit-tags="1" data-options='["A","B","C"]' data-value="A,B,C" disabled />` +
        `<input data-mtx="autocomplete" data-label="B" data-options='["A","B"]' data-value="A" readonly />` +
        `<input data-mtx="autocomplete" data-label="C" data-options='["A","B"]' required data-variant="standard" />` +
        `<input data-mtx="autocomplete" data-label="D" data-options='["A"]' data-free-solo data-error="Bad" />`,
    );
    const { container } = render(
      <>
        <Autocomplete label="A" multiple limitTags={1} options={['A', 'B', 'C']} defaultValue={['A', 'B', 'C']} disabled />
        <Autocomplete label="B" options={['A', 'B']} defaultValue="A" readOnly />
        <Autocomplete label="C" options={['A', 'B']} required variant="standard" />
        <Autocomplete label="D" options={['A']} freeSolo error helperText="Bad" />
      </>,
    );
    const reactRoots = Array.from(container.children);
    const vanillaRoots = Array.from(vanilla.children);
    reactRoots.forEach((root, index) => expectParity(root, vanillaRoots[index]));
  });

  it('popup con grupos, icono, descripción, deshabilitada y resaltado', async () => {
    const data = [
      { value: 'a', label: 'Alpha', group: 'X', icon: 'edit', description: 'd' },
      { value: 'b', label: 'Beta', group: 'X', disabled: true },
      { value: 'c', label: 'Gamma' },
    ];
    const vanilla = await mountVanilla(`<input data-mtx="autocomplete" data-label="G" data-options='${JSON.stringify(data)}' />`);
    const vInput = vanilla.querySelector('input') as HTMLInputElement;
    vInput.focus();
    vInput.value = 'a';
    vInput.dispatchEvent(new Event('input', { bubbles: true }));
    const vanillaPopper = document.querySelector('.mtx-autocomplete__popper') as HTMLElement;
    const vanillaClone = vanillaPopper.cloneNode(true) as HTMLElement;
    const vanillaRoot = vanilla.firstElementChild!.cloneNode(true) as HTMLElement;
    vInput.blur();

    const { container } = render(<Autocomplete label="G" options={data} />);
    const input = container.querySelector('input') as HTMLInputElement;
    act(() => input.focus());
    fireEvent.change(input, { target: { value: 'a' } });
    const reactPopper = Array.from(document.querySelectorAll('.mtx-autocomplete__popper')).find((el) => !vanillaPopper.isSameNode(el));
    // El estado oculto de vanilla conserva un texto obsoleto ("No options"): no forma parte de la paridad.
    expectParity(reactPopper as Element, vanillaClone, { ignoreSelectors: ['.mtx-autocomplete__status[hidden]'] });
    expectParity(container.firstElementChild, vanillaRoot);
  });
});

describe('Autocomplete — filtrado y apertura', () => {
  it('filtra sin tildes ni mayúsculas, resalta y anuncia aria', () => {
    render(<Autocomplete label="Country" options={COUNTRIES} />);
    type('MEX');
    expect(getInput().getAttribute('aria-expanded')).toBe('true');
    expect(getInput().getAttribute('aria-controls')).toBe(listbox()!.id);
    expect(optionEls().map((el) => el.textContent)).toEqual(['México']);
    expect(document.querySelector('.mtx-autocomplete__highlight')!.textContent).toBe('Méx');
  });

  it('matchFrom="start" solo coincide al inicio', () => {
    render(<Autocomplete label="Country" options={COUNTRIES} matchFrom="start" />);
    type('e');
    expect(optionEls()).toHaveLength(0);
    expect(document.querySelector('.mtx-autocomplete__status')!.textContent).toBe('No options');
  });

  it('filterOptions={false} no filtra ni resalta; filterOptions propio', () => {
    const { unmount } = render(<Autocomplete label="Country" options={COUNTRIES} filterOptions={false} />);
    type('zz');
    expect(optionEls()).toHaveLength(5);
    expect(document.querySelector('.mtx-autocomplete__highlight')).toBeNull();
    unmount();
    render(<Autocomplete label="Country" options={COUNTRIES} filterOptions={(opts) => opts.slice(0, 2)} />);
    type('zz');
    expect(optionEls()).toHaveLength(2);
  });

  it('noOptionsText y textos i18n en español', () => {
    render(
      <I18nProvider locale="es">
        <Autocomplete label="País" options={COUNTRIES} />
      </I18nProvider>,
    );
    expect(screen.getByTitle('Abrir')).toBeTruthy();
    type('zz');
    expect(document.querySelector('.mtx-autocomplete__status')!.textContent).toBe('Sin opciones');
    expect(screen.getByTitle('Cerrar')).toBeTruthy();
    expect(screen.getByTitle('Borrar')).toBeTruthy();
  });

  it('al abrir con valor muestra todas y activa la seleccionada', () => {
    render(<Autocomplete label="Country" options={COUNTRIES} defaultValue="pe" />);
    expect(getInput().value).toBe('Peru');
    act(() => getInput().focus());
    key('ArrowDown');
    expect(optionEls()).toHaveLength(5);
    expect(getInput().getAttribute('aria-activedescendant')).toBe(optionEls()[2].id);
    expect(optionEls()[2].getAttribute('aria-selected')).toBe('true');
  });

  it('mousedown en el input alterna el popup y emite open/close', () => {
    const onOpen = vi.fn();
    const onClose = vi.fn();
    render(<Autocomplete label="Country" options={COUNTRIES} onOpen={onOpen} onClose={onClose} />);
    fireEvent.mouseDown(getInput());
    expect(popper()).not.toBeNull();
    expect(onOpen.mock.calls[0][1]).toBe('toggleInput');
    fireEvent.mouseDown(getInput());
    expect(popper()).toBeNull();
    expect(onClose.mock.calls[0][1]).toBe('toggleInput');
  });

  it('open controlado', () => {
    function Demo() {
      const [open, setOpen] = useState(false);
      return <Autocomplete label="C" options={COUNTRIES} open={open} onOpen={() => setOpen(true)} onClose={() => setOpen(false)} />;
    }
    render(<Demo />);
    act(() => getInput().focus());
    key('ArrowDown');
    expect(popper()).not.toBeNull();
    key('Escape');
    expect(popper()).toBeNull();
  });

  it('openOnFocus abre al enfocar', () => {
    render(<Autocomplete label="Country" options={COUNTRIES} openOnFocus />);
    act(() => getInput().focus());
    fireEvent.focus(getInput());
    expect(popper()).not.toBeNull();
  });
});

describe('Autocomplete — teclado', () => {
  it('ArrowDown abre; luego navega saltando deshabilitadas y envuelve', () => {
    const onHighlight = vi.fn();
    render(<Autocomplete label="Country" options={COUNTRIES} onHighlightChange={onHighlight} />);
    act(() => getInput().focus());
    key('ArrowDown');
    expect(getInput().hasAttribute('aria-activedescendant')).toBe(false);
    key('ArrowDown');
    expect(getInput().getAttribute('aria-activedescendant')).toBe(optionEls()[0].id);
    expect(onHighlight).toHaveBeenLastCalledWith(expect.anything(), COUNTRIES[0], 'keyboard');
    key('ArrowDown');
    key('ArrowDown');
    key('ArrowDown');
    expect(optionEls()[4].classList.contains('mtx-autocomplete__option--focused')).toBe(true);
    key('ArrowDown');
    expect(optionEls()[0].classList.contains('mtx-autocomplete__option--focused')).toBe(true);
    key('ArrowUp');
    expect(optionEls()[4].classList.contains('mtx-autocomplete__option--focused')).toBe(true);
    key('Home');
    expect(optionEls()[0].classList.contains('mtx-autocomplete__option--focused')).toBe(true);
    key('End');
    expect(optionEls()[4].classList.contains('mtx-autocomplete__option--focused')).toBe(true);
    key('PageUp');
    expect(optionEls()[0].classList.contains('mtx-autocomplete__option--focused')).toBe(true);
  });

  it('includeInputInList vuelve al input en los extremos', () => {
    render(<Autocomplete label="Country" options={['A', 'B']} includeInputInList autoHighlight />);
    act(() => getInput().focus());
    key('ArrowDown');
    expect(optionEls()[0].classList.contains('mtx-autocomplete__option--focused')).toBe(true);
    key('ArrowUp');
    expect(getInput().hasAttribute('aria-activedescendant')).toBe(false);
  });

  it('Enter selecciona, emite change y cierra', () => {
    const onChange = vi.fn();
    render(<Autocomplete label="Country" options={COUNTRIES} onChange={onChange} />);
    type('per');
    key('ArrowDown');
    key('Enter');
    expect(onChange).toHaveBeenCalledWith(expect.anything(), COUNTRIES[2], 'selectOption', { option: COUNTRIES[2] });
    expect(getInput().value).toBe('Peru');
    expect(popper()).toBeNull();
  });

  it('Escape cierra y, con clearOnEscape, luego limpia', () => {
    const onChange = vi.fn();
    render(<Autocomplete label="Country" options={COUNTRIES} defaultValue="co" clearOnEscape onChange={onChange} />);
    act(() => getInput().focus());
    key('ArrowDown');
    expect(popper()).not.toBeNull();
    key('Escape');
    expect(popper()).toBeNull();
    expect(getInput().value).toBe('Colombia');
    key('Escape');
    expect(getInput().value).toBe('');
    expect(onChange.mock.calls[0][2]).toBe('clear');
  });

  it('autoHighlight + autoSelect: Tab acepta la primera', () => {
    const onChange = vi.fn();
    render(<Autocomplete label="Country" options={COUNTRIES} autoHighlight autoSelect onChange={onChange} />);
    type('a');
    expect(optionEls()[0].classList.contains('mtx-autocomplete__option--focused')).toBe(true);
    key('Tab');
    expect(onChange.mock.calls[0][1]).toBe(COUNTRIES[0]);
  });

  it('blur restaura el texto al valor', () => {
    render(<Autocomplete label="Country" options={COUNTRIES} defaultValue="co" />);
    type('xyz');
    fireEvent.blur(getInput());
    expect(getInput().value).toBe('Colombia');
  });
});

describe('Autocomplete — limpiar, free solo y múltiple', () => {
  it('botón limpiar vacía y emite input clear', () => {
    const onInput = vi.fn();
    render(<Autocomplete label="Country" options={COUNTRIES} defaultValue="co" onInputChange={onInput} />);
    const clear = screen.getByTitle('Clear');
    expect(clear.hidden).toBe(false);
    fireEvent.click(clear);
    expect(getInput().value).toBe('');
    expect(onInput).toHaveBeenLastCalledWith(expect.anything(), '', 'clear');
    expect(clear.hidden).toBe(true);
  });

  it('free solo: Enter crea un valor libre y sin botón popup', () => {
    const onChange = vi.fn();
    render(<Autocomplete label="Search" options={['a']} freeSolo onChange={onChange} />);
    expect(screen.getByTitle('Open').hidden).toBe(true);
    type('hello');
    key('Enter');
    expect(onChange.mock.calls[0][1]).toBe('hello');
    expect(onChange.mock.calls[0][2]).toBe('createOption');
  });

  it('múltiple: chips, inputs ocultos, Backspace y borrar chip', () => {
    const onChange = vi.fn();
    const { container } = render(
      <Autocomplete label="Skills" multiple options={COUNTRIES} defaultValue={['co', 'mx']} name="c" onChange={onChange} />,
    );
    const hidden = () => Array.from(container.querySelectorAll<HTMLInputElement>('input[type="hidden"]')).map((i) => i.value);
    expect(hidden()).toEqual(['co', 'mx']);
    expect(container.querySelectorAll('.mtx-autocomplete__tag')).toHaveLength(2);
    act(() => getInput().focus());
    key('Backspace');
    expect(hidden()).toEqual(['co']);
    expect(onChange.mock.calls[0][2]).toBe('removeOption');
    fireEvent.click(container.querySelector('.mtx-chip__delete')!);
    expect(hidden()).toEqual([]);
  });

  it('múltiple: seleccionar añade y quita; disableCloseOnSelect mantiene abierto', () => {
    render(<Autocomplete label="Skills" multiple disableCloseOnSelect options={COUNTRIES} />);
    act(() => getInput().focus());
    key('ArrowDown');
    fireEvent.click(optionEls()[0]);
    expect(popper()).not.toBeNull();
    expect(optionEls()[0].getAttribute('aria-selected')).toBe('true');
    fireEvent.click(optionEls()[0]);
    expect(optionEls()[0].getAttribute('aria-selected')).toBe('false');
  });

  it('limitTags muestra +N sin foco', () => {
    const { container } = render(<Autocomplete label="C" multiple limitTags={2} options={COUNTRIES} defaultValue={['co', 'mx', 'pe']} />);
    expect(container.querySelectorAll('.mtx-autocomplete__tag')).toHaveLength(2);
    expect(container.querySelector('.mtx-autocomplete__tag-more')!.textContent).toBe('+1');
    act(() => getInput().focus());
    expect(container.querySelectorAll('.mtx-autocomplete__tag')).toHaveLength(3);
  });

  it('valueFormat csv envía un único campo', () => {
    const { container } = render(
      <Autocomplete label="C" multiple valueFormat="csv" name="c" options={COUNTRIES} defaultValue={['co', 'pe']} />,
    );
    const hidden = container.querySelectorAll<HTMLInputElement>('input[type="hidden"]');
    expect(hidden).toHaveLength(1);
    expect(hidden[0].value).toBe('co,pe');
  });
});

describe('Autocomplete — estados, carga y formulario', () => {
  it('disabled y readOnly no abren', () => {
    const { unmount } = render(<Autocomplete label="C" options={COUNTRIES} disabled defaultValue="co" name="c" />);
    expect(getInput().disabled).toBe(true);
    fireEvent.mouseDown(getInput());
    expect(popper()).toBeNull();
    expect((document.querySelector('input[type="hidden"]') as HTMLInputElement).disabled).toBe(true);
    unmount();
    render(<Autocomplete label="C" options={COUNTRIES} readOnly defaultValue="co" />);
    fireEvent.mouseDown(getInput());
    expect(popper()).toBeNull();
    expect(getInput().getAttribute('aria-readonly')).toBe('true');
  });

  it('required: validez nativa según valor y texto', () => {
    render(<Autocomplete label="C" options={COUNTRIES} required />);
    expect(getInput().required).toBe(true);
    type('zz');
    expect(getInput().validationMessage).toBe('Select an option from the list.');
  });

  it('loading muestra CircularProgress y "Loading…" sin opciones', () => {
    render(<Autocomplete label="C" options={[]} loading />);
    expect(document.querySelector('.mtx-circular-progress')).not.toBeNull();
    act(() => getInput().focus());
    key('ArrowDown');
    expect(document.querySelector('.mtx-autocomplete__status')!.textContent).toBe('Loading…');
  });

  it('debounce retrasa onInputChange al escribir', () => {
    vi.useFakeTimers();
    try {
      const onInput = vi.fn();
      render(<Autocomplete label="C" options={COUNTRIES} debounce={300} onInputChange={onInput} />);
      type('c');
      type('co');
      expect(onInput).not.toHaveBeenCalled();
      act(() => {
        vi.advanceTimersByTime(300);
      });
      expect(onInput).toHaveBeenCalledTimes(1);
      expect(onInput.mock.calls[0][1]).toBe('co');
    } finally {
      vi.useRealTimers();
    }
  });

  it('las opciones nuevas actualizan la etiqueta del valor', () => {
    const { rerender } = render(<Autocomplete label="C" options={[] as typeof COUNTRIES} defaultValue="co" />);
    expect(getInput().value).toBe('co');
    rerender(<Autocomplete label="C" options={COUNTRIES} defaultValue="co" />);
    expect(getInput().value).toBe('Colombia');
  });

  it('value controlado actualiza el texto', () => {
    const { rerender } = render(<Autocomplete label="C" options={COUNTRIES} value="co" />);
    expect(getInput().value).toBe('Colombia');
    rerender(<Autocomplete label="C" options={COUNTRIES} value="pe" />);
    expect(getInput().value).toBe('Peru');
  });

  it('envía el valor con FormData y el reset restaura el inicial', () => {
    vi.useFakeTimers();
    try {
      const { container } = render(
        <form>
          <Autocomplete label="C" options={COUNTRIES} name="country" defaultValue="co" />
        </form>,
      );
      const form = container.querySelector('form')!;
      expect(new FormData(form).get('country')).toBe('co');
      type('per');
      key('ArrowDown');
      key('Enter');
      expect(new FormData(form).get('country')).toBe('pe');
      fireEvent.reset(form);
      act(() => {
        vi.runAllTimers();
      });
      expect(new FormData(form).get('country')).toBe('co');
      expect(getInput().value).toBe('Colombia');
    } finally {
      vi.useRealTimers();
    }
  });

  it('getOptionLabel, groupBy e isOptionEqualToValue con objetos propios', () => {
    const films = [
      { title: 'Alien', year: 1979 },
      { title: 'Amélie', year: 2001 },
    ];
    render(
      <Autocomplete
        label="F"
        options={films}
        getOptionLabel={(f) => f.title}
        groupBy={(f) => (f.year < 2000 ? '1900s' : '2000s')}
        isOptionEqualToValue={(a, b) => a.title === b.title}
        defaultValue={{ title: 'Alien', year: 1979 }}
      />,
    );
    expect(getInput().value).toBe('Alien');
    act(() => getInput().focus());
    key('ArrowDown');
    expect(Array.from(document.querySelectorAll('.mtx-autocomplete__group-label')).map((el) => el.textContent)).toEqual([
      '1900s',
      '2000s',
    ]);
  });

  it('hereda error, disabled y required de FormControl y enlaza su helper', () => {
    const { container, unmount } = render(
      <FormControl error required>
        <Autocomplete label="C" options={COUNTRIES} />
        <FormHelperText>Pick one</FormHelperText>
      </FormControl>,
    );
    const input = getInput();
    expect(container.querySelector('.mtx-text-field--error')).not.toBeNull();
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.required).toBe(true);
    const helper = container.querySelector('.mtx-form-helper-text') as HTMLElement;
    expect(helper.id).toBeTruthy();
    expect(input.getAttribute('aria-describedby')).toContain(helper.id);
    unmount();

    const second = render(
      <FormControl disabled error>
        <Autocomplete label="C" options={COUNTRIES} error={false} helperText="Own" />
        <FormHelperText>Shared</FormHelperText>
      </FormControl>,
    );
    const own = getInput();
    expect(own.disabled).toBe(true);
    expect(own.hasAttribute('aria-invalid')).toBe(false);
    const ids = (own.getAttribute('aria-describedby') ?? '').split(' ');
    expect(ids).toHaveLength(1);
    expect(second.container.querySelector(`#${ids[0]}`)!.textContent).toBe('Own');
  });
});
