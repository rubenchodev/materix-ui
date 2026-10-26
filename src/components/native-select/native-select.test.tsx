import { createRef, useState } from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectParity, mountVanilla } from '../../../tests/parity';
import { FormControl, FormHelperText } from '../form-helper-text';
import { NativeSelect } from './index';

const AGE = [
  { value: '10', label: 'Ten' },
  { value: '20', label: 'Twenty' },
];

describe('NativeSelect', () => {
  it('renderiza contenedor, label asociado, select y chevron decorativo', () => {
    const { container } = render(<NativeSelect label="Age" options={AGE} />);
    const root = container.querySelector('.mtx-native-select') as HTMLDivElement;
    expect(root).toHaveClass('mtx-native-select', 'mtx-native-select--standard', 'mtx-native-select--has-label');
    const select = screen.getByRole('combobox', { name: 'Age' }) as HTMLSelectElement;
    expect(select).toHaveClass('mtx-native-select__input');
    expect(select.id).not.toBe('');
    expect(select.labels[0]).toHaveClass('mtx-native-select__label');
    const chevron = root.querySelector('.mtx-native-select__chevron')!;
    expect(chevron).toHaveAttribute('aria-hidden', 'true');
    expect(chevron.querySelector('svg path')).toHaveAttribute('d', 'M7 10l5 5 5-5z');
  });

  it('paridad DOM con vanilla (single-element con label y variante)', async () => {
    const vanilla = await mountVanilla(
      '<select class="extra" data-mtx="native-select" data-label="Age" data-variant="outlined" data-size="small">'
        + '<option value="10">Ten</option><option value="20">Twenty</option></select>',
    );
    const { container } = render(<NativeSelect className="extra" label="Age" variant="outlined" size="small" options={AGE} />);
    expectParity(container.querySelector('.mtx-native-select'), vanilla.firstElementChild);
  });

  it('paridad DOM con vanilla: error y multiple sin label', async () => {
    const vanilla = await mountVanilla(
      '<select data-mtx="native-select" data-variant="filled" data-error multiple aria-label="Langs">'
        + '<option value="js">JS</option><option value="ts">TS</option></select>',
    );
    const { container } = render(
      <NativeSelect variant="filled" error multiple aria-label="Langs" defaultValue={[]}>
        <option value="js">JS</option>
        <option value="ts">TS</option>
      </NativeSelect>,
    );
    expectParity(container.querySelector('.mtx-native-select'), vanilla.firstElementChild);
  });

  it('options con grupos y opciones deshabilitadas', () => {
    const { container } = render(
      <NativeSelect
        aria-label="City"
        options={[
          { label: 'Colombia', options: [{ value: 'bog', label: 'Bogotá' }] },
          { label: 'Mexico', options: [{ value: 'gdl', label: 'Guadalajara', disabled: true }] },
          { value: 'other', label: 'Other' },
        ]}
      />,
    );
    const groups = container.querySelectorAll('optgroup');
    expect(groups).toHaveLength(2);
    expect(groups[0]).toHaveAttribute('label', 'Colombia');
    expect(container.querySelector('option[value="gdl"]')).toBeDisabled();
    expect(container.querySelectorAll('option')).toHaveLength(3);
  });

  it('no controlado: defaultValue y onChange con el valor', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<NativeSelect label="Age" options={AGE} defaultValue="20" onChange={onChange} />);
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('20');
    await user.selectOptions(select, '10');
    expect(select.value).toBe('10');
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), '10');
  });

  it('controlado: refleja el estado del padre', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState('10');
      return (
        <>
          <NativeSelect label="Age" options={AGE} value={value} onChange={(_, next) => setValue(next as string)} />
          <span data-testid="state">{value}</span>
        </>
      );
    }
    render(<Controlled />);
    await user.selectOptions(screen.getByRole('combobox'), '20');
    expect(screen.getByTestId('state')).toHaveTextContent('20');
  });

  it('multiple: onChange entrega un array', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(
      <NativeSelect label="Langs" multiple htmlSize={3} defaultValue={['js']} onChange={onChange}
        options={[{ value: 'js', label: 'JS' }, { value: 'ts', label: 'TS' }]} />,
    );
    expect(container.querySelector('.mtx-native-select')).toHaveClass('mtx-native-select--multiple');
    const select = screen.getByRole('listbox') as HTMLSelectElement;
    expect(select).toHaveAttribute('size', '3');
    await user.selectOptions(select, 'ts');
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), ['js', 'ts']);
  });

  it('error + helperText: aria-invalid, aria-describedby y FormHelperText', () => {
    const { container } = render(<NativeSelect label="Size" options={AGE} error helperText="Pick a size" />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('aria-invalid', 'true');
    const helper = container.querySelector('.mtx-form-helper-text')!;
    expect(helper).toHaveTextContent('Pick a size');
    expect(helper).toHaveClass('mtx-form-helper-text--error');
    expect(select.getAttribute('aria-describedby')).toContain(helper.id);
    expect(container.firstElementChild).toHaveClass('mtx-form-control');
    expect(container.querySelector('.mtx-native-select')).toHaveClass('mtx-native-select--error');
  });

  it('hereda disabled y error de FormControl', () => {
    render(
      <FormControl error disabled>
        <NativeSelect label="Plan" options={AGE} />
        <FormHelperText>Required</FormHelperText>
      </FormControl>,
    );
    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
    expect(select).toHaveAttribute('aria-invalid', 'true');
  });

  it('ref, inputRef, props nativas, required y fullWidth', () => {
    const ref = createRef<HTMLDivElement>();
    const inputRef = createRef<HTMLSelectElement>();
    render(
      <NativeSelect ref={ref} inputRef={inputRef} id="age" name="age" required fullWidth={false}
        data-testid="root" label="Age" options={AGE} />,
    );
    expect(ref.current).toHaveClass('mtx-native-select');
    expect(ref.current).toHaveAttribute('data-testid', 'root');
    expect(ref.current!.style.width).toBe('auto');
    expect(inputRef.current!.id).toBe('age');
    expect(inputRef.current).toHaveAttribute('name', 'age');
    expect(inputRef.current).toBeRequired();
    expect(screen.getByText('Age')).toHaveAttribute('for', 'age');
  });

  it('sin label no genera id ni la clase has-label', () => {
    const { container } = render(<NativeSelect aria-label="Plain" options={AGE} />);
    expect(container.querySelector('.mtx-native-select')).not.toHaveClass('mtx-native-select--has-label');
    expect(screen.getByRole('combobox', { name: 'Plain' }).id).toBe('');
  });

  it('encadena onFocus/onBlur con los de inputProps', () => {
    const order: string[] = [];
    render(
      <NativeSelect
        aria-label="F"
        options={AGE}
        onFocus={() => order.push('focus')}
        onBlur={() => order.push('blur')}
        inputProps={{ onFocus: () => order.push('inputProps.focus'), onBlur: () => order.push('inputProps.blur') }}
      />,
    );
    const select = screen.getByRole('combobox');
    act(() => select.focus());
    act(() => select.blur());
    expect(order).toEqual(['inputProps.focus', 'focus', 'inputProps.blur', 'blur']);
  });

  it('fullWidth estira el contenedor .mtx-form-control con helperText', () => {
    const { container, rerender } = render(<NativeSelect label="A" options={AGE} helperText="Help" />);
    const wrapper = container.querySelector<HTMLElement>('.mtx-form-control')!;
    expect(wrapper.style.width).toBe('100%');
    rerender(<NativeSelect label="A" options={AGE} helperText="Help" fullWidth={false} />);
    expect(wrapper.style.width).toBe('');
    rerender(<NativeSelect label="A" options={AGE} fullWidth={false} />);
    expect(wrapper.style.display).toBe('contents');
  });

  it('conserva el nodo y el foco al aparecer o desaparecer helperText', () => {
    const { rerender } = render(<NativeSelect label="Size" options={AGE} />);
    const select = screen.getByRole('combobox');
    select.focus();
    rerender(<NativeSelect label="Size" options={AGE} error helperText="Pick a size" />);
    expect(screen.getByRole('combobox')).toBe(select);
    expect(document.activeElement).toBe(select);
    rerender(<NativeSelect label="Size" options={AGE} />);
    expect(screen.getByRole('combobox')).toBe(select);
    expect(document.activeElement).toBe(select);
  });
});
